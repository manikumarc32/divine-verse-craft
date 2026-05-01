import { useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { LotusIcon } from "@/components/icons/LotusIcon";

const SIZES = [
  { code: "A4", w: 21,   h: 29.7, scale: 0.55 },
  { code: "A3", w: 29.7, h: 42,   scale: 0.78 },
  { code: "A2", w: 42,   h: 59.4, scale: 1.0  },
];

const MATERIALS = [
  {
    name: "Poster Paper 200gsm",
    desc: "Premium matte paper with a soft, non-glare finish. Best value and our most popular choice.",
    pill: "Most popular",
  },
  {
    name: "Canvas 340gsm",
    desc: "Gallery-grade canvas with a fine textured weave. Looks museum-ready, no frame required.",
    pill: "Premium",
  },
  {
    name: "Cloth Tapestry",
    desc: "Soft printed fabric you can hang loose with rods. Perfect for meditation rooms and shrines.",
    pill: "Spiritual",
  },
  {
    name: "Eco Paper 180gsm",
    desc: "Recycled, FSC-certified paper with a natural cream tone. The mindful choice.",
    pill: "Sustainable",
  },
];

export default function SizeGuide() {
  useEffect(() => { document.title = "Size & Material Guide — DivineVerse Art"; }, []);

  return (
    <PageLayout>
      <div className="container py-16 max-w-4xl">
        <div className="text-center mb-12">
          <LotusIcon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Size & Material Guide</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">Find the right scale and surface for your sacred space.</p>
        </div>

        {/* Visual size comparison */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 text-center">Compare sizes</h2>
          <div className="card-spiritual p-8 md:p-12">
            <div className="flex items-end justify-center gap-6 md:gap-10">
              {SIZES.map((s) => (
                <div key={s.code} className="flex flex-col items-center">
                  <div
                    className="bg-gradient-cream border-[6px] border-double border-accent/50 rounded-md flex items-center justify-center text-accent font-serif"
                    style={{
                      width: `${s.w * s.scale * 4}px`,
                      height: `${s.h * s.scale * 4}px`,
                    }}
                  >
                    <span className="text-3xl">ॐ</span>
                  </div>
                  <p className="font-serif text-xl mt-3">{s.code}</p>
                  <p className="text-xs text-brand-mid">{s.w} × {s.h} cm</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-brand-mid mt-6">Drawn approximately to scale.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
            {[
              ["A4", "Bedside, small shelves, gallery walls"],
              ["A3", "Living room feature, hallway, study"],
              ["A2", "Statement piece — meditation room, entryway"],
            ].map(([s, where]) => (
              <div key={s} className="card-spiritual p-4">
                <p className="font-serif text-lg">{s}</p>
                <p className="text-brand-mid">{where}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Materials */}
        <section>
          <h2 className="font-serif text-2xl mb-6 text-center">Materials</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {MATERIALS.map((m) => (
              <div key={m.name} className="card-spiritual p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-serif text-lg">{m.name}</h3>
                  <span className="chip bg-accent/15 text-accent border-accent/30 text-[11px] px-2 py-0.5">{m.pill}</span>
                </div>
                <p className="text-sm text-brand-mid leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
