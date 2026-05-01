import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Save } from "lucide-react";

type ProductRow = {
  id: string;
  title: string;
  category: string;
  slug: string;
  sanskrit: string | null;
  chapter_ref: string | null;
  english_meaning: string | null;
  telugu_meaning: string | null;
  deeper_meaning: string | null;
  deeper_meaning_te: string | null;
  hero_image_url: string | null;
  layout_mode: string | null;
  full_text_te: string | null;
  full_text_en: string | null;
};

type Edits = Partial<Pick<ProductRow,
  "sanskrit" | "chapter_ref" | "english_meaning" | "telugu_meaning" | "deeper_meaning" | "deeper_meaning_te" | "hero_image_url" | "layout_mode" | "full_text_te" | "full_text_en"
>>;

export function MeaningsEditor() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [edits, setEdits] = useState<Record<string, Edits>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id,title,category,slug,sanskrit,chapter_ref,english_meaning,telugu_meaning,deeper_meaning,deeper_meaning_te,hero_image_url,layout_mode,full_text_te,full_text_en")
      .order("category")
      .order("sort_order");
    if (error) toast.error(error.message);
    setRows((data ?? []) as ProductRow[]);
    setLoading(false);
  }

  const categories = useMemo(() => {
    const set = new Set(rows.map((r) => r.category));
    return ["all", ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.english_meaning ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, search, category]);

  function setField(id: string, key: keyof Edits, value: string) {
    setEdits((e) => ({ ...e, [id]: { ...e[id], [key]: value } }));
  }

  function valueOf(row: ProductRow, key: keyof Edits): string {
    const e = edits[row.id]?.[key];
    if (e !== undefined) return e ?? "";
    return (row[key] ?? "") as string;
  }

  function isDirty(id: string) {
    return edits[id] && Object.keys(edits[id]).length > 0;
  }

  async function save(row: ProductRow) {
    const patch = edits[row.id];
    if (!patch) return;
    setSavingId(row.id);
    // normalize empty strings to null
    const clean: Edits = {};
    (Object.keys(patch) as (keyof Edits)[]).forEach((k) => {
      const v = patch[k];
      clean[k] = v === "" ? null : v;
    });
    const { error } = await supabase.from("products").update(clean).eq("id", row.id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...clean } : r)));
    setEdits((e) => { const n = { ...e }; delete n[row.id]; return n; });
    toast.success(`Saved "${row.title}"`);
  }

  if (loading) return <div className="p-10 text-center text-brand-mid">Loading meanings…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-mid" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, slug or meaning…"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c === "all" ? "All categories" : c.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-brand-mid ml-auto">{filtered.length} of {rows.length}</p>
      </div>

      <div className="space-y-4">
        {filtered.map((row) => (
          <div key={row.id} className="card-spiritual p-5">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div>
                <p className="font-serif text-lg">{row.title}</p>
                <p className="text-xs text-brand-mid font-mono">{row.category} · {row.slug}</p>
              </div>
              <Button
                size="sm"
                onClick={() => save(row)}
                disabled={!isDirty(row.id) || savingId === row.id}
                className="bg-gradient-saffron text-primary-foreground border-0"
              >
                <Save className="h-4 w-4 mr-1" />
                {savingId === row.id ? "Saving…" : isDirty(row.id) ? "Save changes" : "Saved"}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Sanskrit / Devanagari" mono>
                <Textarea
                  value={valueOf(row, "sanskrit")}
                  onChange={(e) => setField(row.id, "sanskrit", e.target.value)}
                  rows={2}
                  className="sanskrit"
                />
              </Field>
              <Field label="Chapter / Source reference">
                <Input
                  value={valueOf(row, "chapter_ref")}
                  onChange={(e) => setField(row.id, "chapter_ref", e.target.value)}
                  placeholder="e.g. Bhagavad Gita 2.47"
                />
              </Field>
              <Field label="Hero image URL (shows on product card)">
                <Input
                  value={valueOf(row, "hero_image_url")}
                  onChange={(e) => setField(row.id, "hero_image_url", e.target.value)}
                  placeholder="https://… (leave empty to use the abstract verse card)"
                />
                {valueOf(row, "hero_image_url") && (
                  <img
                    src={valueOf(row, "hero_image_url")}
                    alt=""
                    className="mt-2 h-24 rounded border border-border object-cover"
                  />
                )}
              </Field>
              <Field label="Short meaning (English)">
                <Textarea
                  value={valueOf(row, "english_meaning")}
                  onChange={(e) => setField(row.id, "english_meaning", e.target.value)}
                  rows={3}
                  maxLength={500}
                />
              </Field>
              <Field label="Short meaning (Telugu)">
                <Textarea
                  value={valueOf(row, "telugu_meaning")}
                  onChange={(e) => setField(row.id, "telugu_meaning", e.target.value)}
                  rows={3}
                  maxLength={500}
                />
              </Field>
              <Field label="Deeper meaning (English)">
                <Textarea
                  value={valueOf(row, "deeper_meaning")}
                  onChange={(e) => setField(row.id, "deeper_meaning", e.target.value)}
                  rows={4}
                  maxLength={2000}
                />
              </Field>
              <Field label="Deeper meaning (Telugu)">
                <Textarea
                  value={valueOf(row, "deeper_meaning_te")}
                  onChange={(e) => setField(row.id, "deeper_meaning_te", e.target.value)}
                  rows={4}
                  maxLength={2000}
                />
              </Field>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-brand-mid py-10">No products match your filters.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <label className={`text-xs uppercase tracking-wider mb-1.5 block ${mono ? "font-mono" : ""} text-brand-mid`}>
        {label}
      </label>
      {children}
    </div>
  );
}
