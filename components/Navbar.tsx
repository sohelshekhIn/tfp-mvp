import Link from "next/link";
import LogoutBtn from "./LogoutBtn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const Navbar = async () => {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();
  return (
    <div className="w-full flex justify-between p-3 px-5 shadow-lg m-1 rounded-md">
      <Link href="/" className="flex items-center">
        <h1 className="text-blue-600 text-xl font-bold">NFP Portal</h1>
      </Link>
      {data.user && <LogoutBtn />}
    </div>
  );
};

export default Navbar;
