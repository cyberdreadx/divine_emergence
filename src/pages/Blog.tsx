import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Feather } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailSignup from "@/components/EmailSignup";
import NotFound from "@/pages/NotFound";
import { blogPosts, getPost, longDate } from "@/lib/media";
import { excerpt, renderMarkdown } from "@/lib/markdown";

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="on-dark-bg de-backdrop min-h-screen relative flex flex-col">
    <Navbar />
    <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-12">{children}</main>
    <Footer />
  </div>
);

/** /blog: every published post, newest first. */
export const BlogList = () => {
  useEffect(() => {
    document.title = "Blog | Divine Emergence";
  }, []);

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="inline-flex items-center gap-3 text-gold font-sans text-xs uppercase tracking-[0.3em] mb-6">
            <Feather className="w-4 h-4" strokeWidth={1.5} />
            Reflections from Laura
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.05] mb-6">
            The <span className="italic">Journal</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stories, experiences, and lessons from the path: breath, medicine, integration, and coming home to yourself.
          </p>
        </div>

        {blogPosts.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {blogPosts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.id}`}
                className="group rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-gold/40 transition-colors flex flex-col"
              >
                {p.image && <img src={p.image} alt="" className="w-full aspect-[16/10] object-cover" loading="lazy" />}
                <div className="p-6 md:p-7 flex-1 flex flex-col">
                  <span className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-3">{longDate(p.date)}</span>
                  <h2 className="font-serif text-2xl text-foreground leading-snug mb-3 group-hover:text-gold transition-colors">{p.title}</h2>
                  <p className="text-muted-foreground leading-relaxed flex-1">{p.summary?.trim() || excerpt(p.body)}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-foreground group-hover:text-gold">
                    Read more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-card/40 p-10 md:p-14 text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">The first entries are on their way</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">Join the list below to hear when new writing is shared.</p>
          </div>
        )}

        <div className="mt-16 md:mt-20">
          <EmailSignup />
        </div>
      </div>
    </Shell>
  );
};

/** /blog/<id>: a single post. */
export const BlogPostPage = () => {
  const { id } = useParams();
  const post = getPost(id);

  useEffect(() => {
    if (post) document.title = `${post.title} | Divine Emergence`;
  }, [post]);

  if (!post) return <NotFound />;

  return (
    <Shell>
      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground text-xs tracking-[0.18em] uppercase hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          All posts
        </Link>
        <span className="block text-xs uppercase tracking-[0.25em] text-gold/80 mb-4">{longDate(post.date)}</span>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1] mb-8">{post.title}</h1>
        {post.image && <img src={post.image} alt="" className="w-full aspect-[16/9] object-cover rounded-3xl ring-1 ring-white/10 mb-10" />}
        <div className="de-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="font-serif italic text-xl text-foreground">With love,</p>
          <p className="text-gold mt-1">Laura</p>
        </div>
      </article>
    </Shell>
  );
};
