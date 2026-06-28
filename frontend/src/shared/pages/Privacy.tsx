import { GenericPageLayout } from "../layouts/GenericPageLayout";

export function PrivacyPolicy() {
  return (
    <GenericPageLayout title="Privacy Policy" subtitle="Last updated: October 2026">
      <h2>1. Information We Collect</h2>
      <p>When you use ApplyIQ, we collect personal information you provide to us, including but not nil to your name, email address, and the contents of your resumes.</p>
      
      <h2>2. How We Use Your Data</h2>
      <p>We use your data exclusively to provide and improve the ApplyIQ service. We do not sell your personal data to third parties. We use OpenAI APIs for AI features, and data is processed according to their strict API data usage policies (your data is not used to train their models).</p>

      <h2>3. Data Security</h2>
      <p>We implement strict security measures including AES-256 encryption at rest and TLS 1.3 in transit to protect your resume data.</p>
    </GenericPageLayout>
  );
}
