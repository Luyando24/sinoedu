"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })

      if (error) throw error

      toast.success("Message sent successfully! We will get back to you soon.")
      reset()
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input
            {...register("firstName")}
            placeholder="John"
            className="bg-slate-50"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input
            {...register("lastName")}
            placeholder="Doe"
            className="bg-slate-50"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <Input
          {...register("email")}
          type="email"
          placeholder="john@example.com"
          className="bg-slate-50"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">WhatsApp Number (Optional)</label>
        <Input
          {...register("whatsappNumber")}
          placeholder="+1234567890"
          className="bg-slate-50"
        />
        {errors.whatsappNumber && (
          <p className="text-xs text-red-500">{errors.whatsappNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subject</label>
        <Input
          {...register("subject")}
          placeholder="I have a question about..."
          className="bg-slate-50"
        />
        {errors.subject && (
          <p className="text-xs text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          {...register("message")}
          placeholder="How can we help you?"
          className="bg-slate-50 min-h-[150px]"
        />
        {errors.message && (
          <p className="text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
