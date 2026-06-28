import { GenericPageLayout } from "../layouts/GenericPageLayout";

export function About() {
  return (
    <GenericPageLayout title="About Us" subtitle="Building the unfair advantage for ambitious professionals.">
      <h2>Our Mission</h2>
      <p>At ApplyIQ, we believe that your resume should be a perfect reflection of your potential, not a test of your formatting skills in Microsoft Word.</p>
      
      <h2>The Problem</h2>
      <p>Millions of highly qualified candidates are rejected by automated ATS systems simply because of poorly structured PDFs, invisible fonts, or weak action verbs. The system is broken.</p>

      <h2>Our Solution</h2>
      <p>We've combined elite hiring intelligence with advanced AI to create a machine that builds perfect, ATS-compliant resumes. We're here to democratize access to top-tier careers.</p>
    </GenericPageLayout>
  );
}
