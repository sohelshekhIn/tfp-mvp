"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => {
        supabase.auth.signOut();
        router.push("/login");
      }}
    >
      Logout
    </Button>
  );
  //   }
};

export default LogoutBtn;
