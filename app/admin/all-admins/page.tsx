import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cookies } from "next/headers";

const ShowAllAdminsPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const { data: membersData, error } = await supabase
    .from("members")
    .select("*")
    .eq("role", "admin");

  if (error) {
    console.log(error);
    return;
  }

  return (
    <div className="p-5">
      <div className="py-2">
        <h1 className="text-gray-700 font-semibold text-lg">All Members</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableDataRows membersData={membersData} />
        </TableBody>
      </Table>
    </div>
  );
};

export default ShowAllAdminsPage;

const TableDataRows = ({ membersData }: { membersData: any }) => {
  if (membersData.length === 0) {
    return (
      <TableRow>
        <TableCell>No Admins found</TableCell>
      </TableRow>
    );
  } else {
    return membersData.map((item: { name: string; id: string }) => {
      return (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
        </TableRow>
      );
    });
  }
};
