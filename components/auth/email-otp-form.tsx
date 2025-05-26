"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type FormData = z.infer<typeof formSchema>

interface EmailOtpFormProps {
  savedEmail?: string
  onEmailChange?: (email: string) => void
  onOtpRequest: (email: string) => void
}

export function EmailOtpForm({ savedEmail, onEmailChange, onOtpRequest }: EmailOtpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: savedEmail || "",
    },
  })

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true)
      
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) {
        toast({
          title: "Error sending code",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      onEmailChange?.(data.email)
      onOtpRequest(data.email)
      
      toast({
        title: "Code sent!",
        description: "Check your email for the verification code",
      })
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    onEmailChange?.(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            "Send Code"
          )}
        </Button>
      </form>
    </Form>
  )
}