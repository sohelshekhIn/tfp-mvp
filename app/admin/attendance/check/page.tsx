import { getLocalTimeString } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MemberAttendanceTableBody } from "@/components/Admin/MbrAttnCheckRow";
const CheckMemberAttendancePage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", getLocalTimeString())
    .eq("status", "FALSE");

  if (error) {
    console.log(error);
    return;
  }

  return (
    <div className="p-5">
      <div className="py-2">
        <h1 className="text-gray-700 font-semibold text-lg">
          Check Attendance
        </h1>
        <p className="text-xs font-medium">{new Date().toDateString()}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[20px]">Present</TableHead>
            <TableHead className="w-[20px]">Absent</TableHead>
          </TableRow>
        </TableHeader>
        <MemberAttendanceTableBody attnData={data} />
      </Table>
    </div>
  );
};

export default CheckMemberAttendancePage;
