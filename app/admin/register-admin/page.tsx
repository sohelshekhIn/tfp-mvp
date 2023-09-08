"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";
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

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import LoadingSpinner from "@/components/Loading-spinner";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(3, "Name must be at least 3 characters.")
    .default(""),
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

const RegisterAdminForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    const formattedResoponse = JSON.stringify({
      name: data.name,
      phone: data.phone,
      password: data.password,
      role: "admin",
    });

    fetch("/auth/register-admin", {
      method: "POST",
      body: formattedResoponse,
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
          console.log(data.error);
          return;
        }
        toast({
          title: "Admin Registered",
          description: "Admin Registered Successfully",
        });
        router.push("/admin/");
      });
  };
  return (
    <div className="p-5">
      <div className="py-4">
        <h1 className="text-xl font-semibold">New Admin Registration</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Admin name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Admin Phone number"
                    {...field}
                    type="number"
                  />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Admin password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">
              {submitting ? <LoadingSpinner color="white" /> : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterAdminForm;
