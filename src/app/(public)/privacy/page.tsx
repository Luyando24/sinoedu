export default function PrivacyPage() {
  return (
    <div className="container py-20 max-w-4xl">
      <div className="space-y-6 mb-16 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Your privacy is important to us. This document outlines how we handle your personal information.
        </p>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Last Updated: October 24, 2024
        </p>
      </div>

      <div className="space-y-16">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Sinoway Education (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides educational consultancy services. By using our website and services, you consent to the data practices described in this statement. We are committed to protecting your personal data and ensuring transparency in how we handle it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">2. Data We Collect</h2>
          <div className="bg-muted/30 p-8 rounded-2xl">
            <ul className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-red" /> Personal Identity (Name, Passport)</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-red" /> Contact Details (Email, Phone)</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-red" /> Academic Records (Transcripts)</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-red" /> Financial Proofs</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-red" /> Payment Information</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-red" /> Usage Data & Cookies</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">3. Usage of Information</h2>
          <p className="text-muted-foreground leading-relaxed">
             We use the collected data for various purposes:
          </p>
          <ul className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To process applications to universities on your behalf</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t">
          <h2 className="text-2xl font-bold text-foreground">Contact Our Privacy Officer</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="mt-4 p-6 border rounded-xl inline-block pr-12">
             <p className="font-bold">Sinoway Education Legal Team</p>
             <p className="text-muted-foreground">privacy@sinoway.com</p>
             <p className="text-muted-foreground">+86 10 1234 5678</p>
          </div>
        </section>
      </div>
    </div>
  )
}
