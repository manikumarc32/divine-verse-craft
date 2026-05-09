import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { ProductCard, ProductSummary } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const CATEGORIES = [
  { code: "all", label: "All" },
  { code: "gita_quote", label: "Gita Quotes" },
  { code: "ramayana_quote", label: "Ramayana Verses" },
  { code: "ramayana_scene", label: "Ramayana Scenes" },
  { code: "hanuman_chalisa", label: "Hanuman Chalisa", purple: true },
  { code: "god_portrait", label: "God Portraits" },
  { code: "symbol", label: "Symbols" },
  { code: "hand_written", label: "Hand-Written", purple: true },
];

const EPIC_FILTER: Record<string, string[]> = {
  gita: ["gita_quote"],
  ramayana: ["ramayana_quote", "ramayana_scene", "hanuman_chalisa"],
};

const EPIC_META: Record<string, { title: string; sub: string }> = {
  gita: { title: "Bhagavad Gita Wall Art", sub: "Verses from the Song of God — Sanskrit, Telugu, English" },
  ramayana: { title: "Ramayana Wall Art", sub: "Shlokas, Ram Darbar scenes, and Hanuman Chalisa calligraphy" },
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const category = params.get("category") ?? "all";

  useEffect(() => {
    document.title = "Shop Sacred Wall Art — DivineVerse Art";
    supabase.from("products").select("*").eq("is_active", true).eq("is_launch_ready", true).order("sort_order")
      .then(({ data }) => setProducts((data ?? []) as unknown as ProductSummary[]));
  }, []);

  function setCategory(c: string) {
    if (c === "all") params.delete("category"); else params.set("category", c);
    setParams(params);
  }

  const epic = params.get("epic");

  const filtered = useMemo(() => {
    let f = products;
    if (epic && EPIC_FILTER[epic]) {
      f = f.filter((p) => EPIC_FILTER[epic].includes(p.category));
    }
    if (category !== "all") f = f.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      f = f.filter((p) => p.title.toLowerCase().includes(q) || p.english_meaning?.toLowerCase().includes(q));
    }
    if (sort === "price-asc") f = [...f].sort((a, b) => Number(a.base_price) - Number(b.base_price));
    if (sort === "price-desc") f = [...f].sort((a, b) => Number(b.base_price) - Number(a.base_price));
    if (sort === "rating") f = [...f].sort((a, b) => Number(b.rating) - Number(a.rating));
    return f;
  }, [products, category, search, sort, epic]);

  const meta = epic ? EPIC_META[epic] : null;

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-2">{meta?.title ?? "Sacred Wall Art"}</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">{meta?.sub ?? "Verses, portraits, and calligraphy — all printed in the UK"}</p>
          {epic && (
            <button
              onClick={() => { params.delete("epic"); setParams(params); }}
              className="mt-3 text-xs text-accent hover:underline"
            >
              ← View all epics
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mid" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search verses, deities, mantras…" className="pl-10 h-12" />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="md:w-56 h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => {
            const active = category === c.code;
            return (
              <button
                key={c.code}
                onClick={() => setCategory(c.code)}
                className={cn(
                  "chip min-h-[44px] px-4",
                  active
                    ? c.purple
                      ? "bg-purple-brand text-white border-transparent"
                      : "bg-primary text-primary-foreground border-transparent"
                    : c.purple
                      ? "border-purple-brand text-purple-brand hover:bg-purple-brand/10"
                      : "bg-card border-border hover:bg-muted",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-brand-mid mb-6">{filtered.length} sacred {filtered.length === 1 ? "design" : "designs"}</p>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl text-accent mb-4">ॐ</p>
            <p className="text-brand-mid">No designs match your search yet.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
