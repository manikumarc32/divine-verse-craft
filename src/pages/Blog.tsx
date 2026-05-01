import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";

interface Post { id: string; slug: string; title: string; excerpt: string; category: string; read_time_min: number; published_at: string; }

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    document.title = "Blog — DivineVerse Art";
    supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false })
      .then(({ data }) => setPosts((data ?? []) as Post[]));
  }, []);

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Reflections & Stories</h1>
          <div className="gold-divider-sm mx-auto" />
          <p className="text-brand-mid mt-3">Essays on the Gita, Sanskrit calligraphy, and sacred living</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.id} className="card-spiritual p-6 flex flex-col">
              <span className="chip bg-accent/15 border-accent/30 text-accent self-start mb-3">{p.category}</span>
              <p className="text-xs text-brand-mid mb-2">
                {new Date(p.published_at).toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" })} · {p.read_time_min} min read
              </p>
              <h2 className="font-serif text-xl mb-2">{p.title}</h2>
              <p className="text-sm text-brand-mid">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
