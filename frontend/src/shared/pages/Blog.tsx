import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { useEffect, useState } from "react";

export function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <GenericPageLayout title="ApplyIQ Blog" subtitle="Insights, guides, and updates from our team.">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="h-48 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
          <div className="h-48 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-slate-400 mt-8">No blog posts available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {blogs.map(blog => (
            <div key={blog._id} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-bold mb-3">{blog.title}</h3>
              <p className="text-slate-400 mb-4 line-clamp-3">{blog.snippet || blog.content}</p>
              <div className="text-blue-400 font-medium cursor-pointer">Read More &rarr;</div>
            </div>
          ))}
        </div>
      )}
    </GenericPageLayout>
  );
}
