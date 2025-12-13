import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Chinese Scholarship Agency</h4>
            <p className="text-sm text-muted-foreground">
              Your gateway to world-class education in China. Professional admission and scholarship services.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary">University Admissions</Link></li>
              <li><Link href="/services" className="hover:text-primary">Scholarship Assistance</Link></li>
              <li><Link href="/services" className="hover:text-primary">Visa Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="mb-4 text-sm font-semibold">Contact</h4>
             <ul className="space-y-2 text-sm text-muted-foreground">
               <li>Email: admission@csa.com</li>
               <li>Phone: +86 123 4567 8900</li>
               <li>Beijing, China</li>
             </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Chinese Scholarship Agency. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
