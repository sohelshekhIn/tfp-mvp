export const dynamic = "force-dynamic";

import { getLocalTimeString } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
const ShowAllAttendancePage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", getLocalTimeString());

  if (error) {
    console.log(error);
    return;
  }
  return (
    <div className="p-5">
      <div className="py-2">
        <h1 className="text-gray-700 font-semibold text-lg">
          Today&apos;s Attendance
        </h1>
        <p className="text-xs font-medium">{new Date().toDateString()}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[20px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell>No attendance found for today.</TableCell>
            </TableRow>
          ) : (
            data.map(async (item) => {
              const { data: memberData, error } = await supabase
                .from("members")
                .select("*")
                .eq("id", item.user_id);
              // and also equals to current date
              if (error) {
                console.log(error);
                return;
              }
              return (
                <TableRow key={memberData[0].user_id}>
                  <Link href={`/admin/attendance/check`}>
                    <TableCell className="">{memberData[0].name}</TableCell>
                  </Link>
                  <TableCell className="">
                    {item.status ? (
                      // small green circle
                      <div className="w-3 mx-auto h-3 rounded-full bg-green-500"></div>
                    ) : (
                      <div className="w-3 mx-auto h-3 rounded-full bg-yellow-500"></div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShowAllAttendancePage;
