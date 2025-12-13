import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Have questions? We&apos;re here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Your email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="How can we help?" />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-2">Office Location</h3>
            <p className="text-muted-foreground">
              Level 15, China World Tower B<br />
              Chaoyang District, Beijing<br />
              China
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Contact Info</h3>
            <p className="text-muted-foreground">
              Email: info@csa.com<br />
              Phone: +86 10 1234 5678
            </p>
          </div>
          <div className="h-48 bg-muted rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">Map Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  )
}
