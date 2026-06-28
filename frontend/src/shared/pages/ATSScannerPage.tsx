import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export function ATSScannerPage() {
  return (
    <GenericPageLayout title="ATS Scanner" subtitle="Beat the robot filters with our advanced resume scanner.">
      <div className="mt-8 text-center max-w-2xl mx-auto">
        <Activity className="w-20 h-20 text-emerald-400 mx-auto mb-8" />
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Over 75% of resumes are rejected before a human ever reads them. Our ATS Scanner analyzes your resume's structure, keywords, and formatting to ensure it passes through Applicant Tracking Systems like Workday, Greenhouse, and Lever flawlessly.
        </p>
        <Link to="/register" className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors">
          Scan Your Resume Now
        </Link>
      </div>
    </GenericPageLayout>
  );
}
