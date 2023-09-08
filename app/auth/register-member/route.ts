import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.json();

  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Access auth admin api
  const adminAuthClient = supabase.auth.admin;
  const response = await adminAuthClient.createUser({
    phone: formData.phone,
    email: `sohelshekhnadiad+${formData.phone}@gmail.com`,
    password: "password",
    phone_confirm: true,
    email_confirm: true,
    user_metadata: {
      name: formData.name,
      expiry_date_time: formData.expiry_date_time,
      role: "member",
    },
  });
  if (response.error) {
    return NextResponse.json(
      {
        error: response.error.message,
      },
      { status: 400 }
    );
  }
  return NextResponse.json({ message: "success" });
}
