import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Upload, Loader2, ExternalLink, Wand2 } from "lucide-react";
import { PRODIGI_CATALOGUE, findSku, suggestSkuForCategory } from "@/lib/prodigiCatalogue";

interface Props {
  products: any[];
  onChanged: () => void;
}

export function ProdigiSetupTab({ products, onChanged }: Props) {
  const [filter, setFilter] = useState<"all" | "incomplete">("incomplete");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => !p.prodigi_sku || !(p.prodigi_asset_url || p.hero_image_url));
  }, [products, filter]);

  const readyCount = products.filter((p) => p.prodigi_sku && (p.prodigi_asset_url || p.hero_image_url)).length;

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    const { data, error } = await supabase.functions.invoke("prodigi-test-connection");
    setTesting(false);
    if (error) {
      setTestResult({ ok: false, msg: error.message });
      return;
    }
    if ((data as any)?.ok) {
      setTestResult({ ok: true, msg: "Connected to Prodigi sandbox ✓" });
    } else {
      setTestResult({ ok: false, msg: (data as any)?.error || "Unknown error" });
    }
  }

  async function update(id: string, patch: Record<string, any>) {
    const { error } = await supabase.from("products").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onChanged();
  }

  return (
    <div className="space-y-6">
      {/* Connection test */}
      <div className="card-spiritual p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-serif text-lg">Step 1 — Test Prodigi connection</h3>
            <p className="text-sm text-brand-mid">Confirm your sandbox API key works before configuring products.</p>
          </div>
          <Button onClick={testConnection} disabled={testing}>
            {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Test connection
          </Button>
        </div>
        {testResult && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${testResult.ok ? "text-green-700" : "text-destructive"}`}>
            {testResult.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{testResult.msg}</span>
          </div>
        )}
      </div>

      {/* How to test */}
      <div className="card-spiritual p-5 bg-accent/10">
        <h3 className="font-serif text-lg mb-1">After setup — place a sandbox order</h3>
        <ol className="text-sm text-brand-mid list-decimal pl-5 space-y-1">
          <li>Add a configured product to cart and go to <code>/checkout</code>.</li>
          <li>Pay with test card <code className="font-mono">4242 4242 4242 4242</code>, any future date, any CVC.</li>
          <li>Open the <strong>Orders</strong> tab — the <code>prodigi_order_id</code> appears within seconds.</li>
          <li>Sandbox orders never actually print or ship.</li>
        </ol>
      </div>

      {/* Product checklist */}
      <div className="card-spiritual p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="font-serif text-lg">Step 2 — Configure products</h3>
            <p className="text-sm text-brand-mid">
              {readyCount} of {products.length} ready to fulfil via Prodigi.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant={filter === "incomplete" ? "default" : "outline"} size="sm" onClick={() => setFilter("incomplete")}>
              Incomplete ({products.length - readyCount})
            </Button>
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({products.length})
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((p) => (
            <ProductRow key={p.id} product={p} onUpdate={(patch) => update(p.id, patch)} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-brand-mid text-center py-8">All products configured 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product, onUpdate }: { product: any; onUpdate: (patch: Record<string, any>) => void }) {
  const sku = product.prodigi_sku as string | null;
  const asset = (product.prodigi_asset_url || product.hero_image_url) as string | null;
  const ready = !!sku && !!asset;
  const skuInfo = findSku(sku);

  return (
    <div className="border border-border rounded-lg p-4 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-start">
      {/* Title + status */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          {ready ? (
            <Badge className="bg-green-600 hover:bg-green-700">Ready</Badge>
          ) : (
            <Badge variant="outline" className="border-destructive text-destructive">Needs setup</Badge>
          )}
        </div>
        <p className="font-serif">{product.title}</p>
        <p className="text-xs text-brand-mid capitalize">{product.category.replace("_", " ")} · £{product.base_price}</p>
      </div>

      {/* SKU + asset */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Select value={sku ?? ""} onValueChange={(v) => onUpdate({ prodigi_sku: v })}>
            <SelectTrigger className="h-9 flex-1">
              <SelectValue placeholder="Choose product type & size…" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {PRODIGI_CATALOGUE.map((g) => (
                <SelectGroup key={g.key}>
                  <SelectLabel>{g.label}</SelectLabel>
                  {g.options.map((o) => (
                    <SelectItem key={o.sku} value={o.sku}>
                      {o.label} <span className="text-xs text-brand-mid font-mono ml-2">{o.sku}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            title="Suggest based on category"
            onClick={() => onUpdate({ prodigi_sku: suggestSkuForCategory(product.category) })}
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </div>
        {skuInfo && (
          <p className="text-[11px] text-brand-mid">
            {skuInfo.description} · recommended {skuInfo.recommendedPx.w}×{skuInfo.recommendedPx.h}px ·{" "}
            <a
              href={`https://www.prodigi.com/products/?search=${encodeURIComponent(skuInfo.sku)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline inline-flex items-center gap-0.5"
            >
              View on prodigi.com <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        )}

        <PrintAssetUploader
          productId={product.id}
          currentUrl={asset}
          onUploaded={(url) => onUpdate({ prodigi_asset_url: url, hero_image_url: product.hero_image_url ?? url })}
          onClear={() => onUpdate({ prodigi_asset_url: null })}
        />
      </div>

      {/* Thumb */}
      <div className="w-24 h-24 rounded-md bg-muted overflow-hidden flex items-center justify-center">
        {asset ? (
          <img src={asset} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] text-brand-mid text-center px-1">No print file</span>
        )}
      </div>
    </div>
  );
}

function PrintAssetUploader({
  productId,
  currentUrl,
  onUploaded,
  onClear,
}: {
  productId: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  onClear: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function handle(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("JPG, PNG or WebP only");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File must be under 25MB");
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `prodigi/${productId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type,
      upsert: true,
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    onUploaded(data.publicUrl);
    setBusy(false);
    toast.success("Print file uploaded");
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => ref.current?.click()}
      >
        {busy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
        {currentUrl ? "Replace print file" : "Upload print file"}
      </Button>
      {currentUrl && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
