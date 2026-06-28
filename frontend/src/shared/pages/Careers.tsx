import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { useEffect, useState } from "react";

export function Careers() {
  const [careers, setCareers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/careers`)
      .then(res => res.json())
      .then(data => setCareers(Array.isArray(data) ? data : []))
      .catch(() => setCareers([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <GenericPageLayout title="Careers" subtitle="Come build the future of hiring with us.">
      <h2>Open Positions</h2>
      
      {isLoading ? (
        <div className="mt-8 space-y-4">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl h-32 animate-pulse" />
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl h-32 animate-pulse" />
        </div>
      ) : careers.length === 0 ? (
        <p className="text-slate-400 mt-4">We are not currently hiring for any positions. Please check back later!</p>
      ) : (
        <div className="mt-8 space-y-4">
          {careers.map((career) => (
            <div key={career._id} className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-xl font-bold mb-2">{career.title}</h3>
              <p className="text-slate-400 mb-4">{career.location}</p>
              <a 
                href={career.googleFormLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      )}
    </GenericPageLayout>
  );
}
