"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { CountryCodeSelect } from "./country-code-select"

const formSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a 10-digit phone number"),
})

type FormData = z.infer<typeof formSchema>

interface PhoneAuthFormProps {
  savedPhone?: string
  onPhoneChange?: (phone: string) => void
  onOtpRequest: (phone: string) => void
}

export function PhoneAuthForm({ savedPhone, onPhoneChange, onOtpRequest }: PhoneAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [countryCode, setCountryCode] = useState("PR")
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: savedPhone || "",
    },
  })

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true)
      
      // Always use +1 for both PR and US
      const fullPhoneNumber = `+1${data.phone}`
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      })

      if (error) {
        toast({
          title: "Error sending code",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      onPhoneChange?.(fullPhoneNumber)
      onOtpRequest(fullPhoneNumber)
      
      toast({
        title: "Code sent!",
        description: "Check your phone for the verification code",
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                    disabled={isLoading}
                  />
                  <Input
                    placeholder="7871234567"
                    type="tel"
                    disabled={isLoading}
                    className="flex-1"
                    {...field}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, '')
                      field.onChange(value)
                      onPhoneChange?.(value)
                    }}
                    maxLength={10}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Enter your 10-digit phone number
              </FormDescription>
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