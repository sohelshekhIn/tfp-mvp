"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  membership_duration: z
    .string({
      required_error: "Membership is required.",
    })
    .default(""),
  phone: z
    .string({
      required_error: "Phone is required.",
    })
    .length(10, "Phone number must be 10 digits"),
});

const RegisterMemberForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setSubmitting(true);
    // get current date and time and add membership duration to it and round it off to the nearest minute
    const currentDate = new Date();
    const membershipDuration = data.membership_duration;
    let duration = 0;
    if (membershipDuration === "2 minutes") {
      duration = 2;
    } else if (membershipDuration === "3 months") {
      duration = 3 * 30 * 24 * 60;
    } else if (membershipDuration === "6 months") {
      duration = 6 * 30 * 24 * 60;
    } else if (membershipDuration === "1 year") {
      duration = 12 * 30 * 24 * 60;
    }
    const expiryDate = new Date(currentDate.getTime() + duration * 60000);
    const formattedResoponse = JSON.stringify({
      name: data.name,
      phone: data.phone,
      expiry_date_time: expiryDate,
      role: "member",
    });

    fetch("/auth/register-member", {
      method: "POST",
      body: formattedResoponse,
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        if (data.error) {
          toast({
            title: "Member Registration Failed",
            description: data.error,
            variant: "destructive",
          });
          console.log(data.error);
          return;
        }
        toast({
          title: "Member Registered",
          description: "Member has been registered successfully",
        });
        router.push("/admin/");
      });
  };
  return (
    <div className="p-5">
      <div className="py-4">
        <h1 className="text-xl font-semibold">New Member Registration</h1>
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
                  <Input placeholder="Member name" {...field} />
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
                    placeholder="Member Phone number"
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
            name="membership_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Duration</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration of membership" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2 minutes">2 minutes</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="1 year">1 year</SelectItem>
                  </SelectContent>
                </Select>
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

export default RegisterMemberForm;
