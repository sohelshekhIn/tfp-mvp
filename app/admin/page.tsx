import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="">
      <div className="p-5">
        <h1 className="text-gray-700 font-semibold text-2xl mt-5">
          Hi, {user?.user_metadata.name.split(" ")[0]}
        </h1>
        <div className="w-full py-10 grid grid-cols-2 gap-2">
          <Link
            href="/admin/register-member"
            className="px-4 py-8 bg-indigo-500/70 shadow-inner text-white rounded-md text-center"
          >
            Register Member
          </Link>
          <Link
            href="/admin/attendance/check"
            className="px-4 py-8 bg-indigo-500/70 shadow-inner text-white rounded-md text-center"
          >
            Mark Attendance
          </Link>
          <Link
            href="/admin/attendance/all"
            className="px-4 py-8 bg-indigo-500/70 shadow-inner text-white rounded-md text-center"
          >
            All Attendance&apos;s
          </Link>
          <Link
            href="/admin/register-admin"
            className="px-4 py-8 bg-indigo-500/70 shadow-inner text-white rounded-md text-center"
          >
            Register Admin
          </Link>
          <Link
            href="/admin/all-members"
            className="px-4 py-8 bg-indigo-500/70 shadow-inner text-white rounded-md text-center"
          >
            All Members
          </Link>
        </div>
      </div>
    </div>
  );
}
