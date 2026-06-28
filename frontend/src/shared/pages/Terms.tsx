import { GenericPageLayout } from "../layouts/GenericPageLayout";

export function TermsOfService() {
  return (
    <GenericPageLayout title="Terms of Service" subtitle="Last updated: October 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using ApplyIQ, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
      
      <h2>2. Subscriptions</h2>
      <p>Some parts of the Service are billed on a subscription basis ("Pro"). You will be billed in advance on a recurring and periodic basis depending on the subscription plan you select.</p>

      <h2>3. Fair Use Policy</h2>
      <p>Our AI features are subject to a fair use policy to prevent abuse. Accounts found using automated scripts to generate excessive requests may be suspended without refund.</p>
    </GenericPageLayout>
  );
}
