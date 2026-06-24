export function Overview() {
  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome to your ApplyIQ dashboard.</p>
        </header>
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-lg text-slate-300">
            Head over to <a href="/resumes" className="text-blue-400 hover:underline">My Resumes</a> to see your saved templates, browse new templates, or generate a new resume with AI.
          </p>
        </div>
      </div>
    </div>
  );
}
