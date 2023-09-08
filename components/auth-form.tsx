"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import LoadingSpinner from "./Loading-spinner";

const FormSchema = z.object({
  phone: z
    .string({
      required_error: "Phone is required.",
    })
    .length(10, "Phone number must be 10 digits"),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(8, "Password must be at least 8 characters."),
});

export default function AuthForm() {
  const { toast } = useToast();

  const router = useRouter();
  const supabase = createClientComponentClient();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    const response = await supabase.auth.signInWithPassword({
      phone: data.phone,
      password: data.password,
    });
    setSubmitting(false);
    if (response.error) {
      console.log(response.error.message);
      toast({
        title: "Login Failed",
        description: response.error.message,
        variant: "destructive",
      });
      return;
    }

    console.log("Login Successful");
    toast({
      title: "Login Successful",
    });
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-5">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={submitting} type="submit" className="w-full">
          {submitting ? <LoadingSpinner color="white" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
}
