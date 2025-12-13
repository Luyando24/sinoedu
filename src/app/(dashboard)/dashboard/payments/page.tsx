"use client"

import { useState, useEffect } from "react"
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

import { User } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic'

export default function PaymentsPage() {
  const [amount, setAmount] = useState(100) // Default application fee
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  // This should come from env or user input
  const config = {
    public_key: "FLWPUBK_TEST-SANDBOX-X", // Placeholder
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user?.email || "user@example.com",
      phone_number: "0000000000",
      name: user?.user_metadata?.name || "Student",
    },
    customizations: {
      title: "CSA Application Fee",
      description: "Payment for application processing",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  }

  const handleFlutterPayment = useFlutterwave(config)

  const handlePayment = () => {
    if (!user) {
        toast.error("Please log in first")
        return
    }

    handleFlutterPayment({
      callback: async (response) => {
        console.log(response)
        closePaymentModal() // this will close the modal programmatically
        
        if (response.status === "successful") {
           // Save to Supabase
           // We need application_id, fetch it or just log it
           const { error } = await supabase.from('payments').insert({
             user_id: user.id,
             amount: response.amount,
             transaction_id: response.transaction_id,
             status: 'completed',
             method: 'flutterwave',
           })
           
           if (!error) {
             toast.success("Payment successful!")
           } else {
             toast.error("Payment successful but failed to record. Contact support.")
           }
        } else {
           toast.error("Payment failed.")
        }
      },
      onClose: () => {
        toast.info("Payment cancelled")
      },
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Make Payment</CardTitle>
          <CardDescription>Pay your application fee to proceed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
             <label className="text-sm font-medium">Amount (USD)</label>
             <Input 
               type="number" 
               value={amount} 
               onChange={(e) => setAmount(Number(e.target.value))}
               disabled
             />
             <p className="text-xs text-muted-foreground">Standard application fee</p>
           </div>
           
           <Button className="w-full" onClick={handlePayment} disabled={!user}>
             Pay with Flutterwave
           </Button>
        </CardContent>
      </Card>
    </div>
  )
}
