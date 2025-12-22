"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [role, setRole] = useState("user") // 'user' or 'agent'
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Attempting registration for:", email, "Role:", role)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            country,
            role, // Pass role to metadata
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      console.log("Registration response:", { data, error })

      if (error) {
        console.error("Supabase Auth Error:", error)
        toast.error(error.message)
        return
      }

      if (data?.user && data?.user?.identities?.length === 0) {
         console.warn("User already registered or email confirmation required")
         toast.error("This email is already registered.")
         return
      }

      if (role === 'agent') {
        toast.success("Agent account request submitted! Please wait for admin approval.")
      } else {
        toast.success("Account created successfully! You can now log in.")
      }
      
      router.push("/auth/login")
    } catch (error) {
      console.error("Unexpected Registration Error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Start your journey to studying in China
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${role === 'user' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-muted hover:border-primary/50'}`}
              onClick={() => setRole('user')}
            >
              <div className="font-semibold">Student</div>
              <div className="text-xs text-muted-foreground mt-1">For personal application</div>
            </div>
            <div 
              className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${role === 'agent' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-muted hover:border-primary/50'}`}
              onClick={() => setRole('agent')}
            >
              <div className="font-semibold">Agent</div>
              <div className="text-xs text-muted-foreground mt-1">For managing students</div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">Country</label>
            <Input
              id="country"
              placeholder="Your Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-blue hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
