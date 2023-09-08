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

function daysToYearsMonthsAndDays(days: number) {
  const daysInYear = 365;
  const daysInMonth = 30; // Assuming an average of 30 days per month
  const years = Math.floor(days / daysInYear);
  days -= years * daysInYear;
  const months = Math.floor(days / daysInMonth);
  days -= months * daysInMonth;
  if (years > 0) {
    return `${years}y ${months}m ${days}d`;
  } else if (months > 0) {
    return `${months}m ${days}d`;
  } else if (days > 0) {
    return `${days} days`;
  }
}

const ShowAllMembersPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const { data: membersData, error } = await supabase
    .from("members")
    .select("*")
    .eq("role", "member");

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
            <TableHead className="w-[30px]">Exp On</TableHead>
            <TableHead className="w-[30px]">Exp In</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableDataRows membersData={membersData} />
        </TableBody>
      </Table>
    </div>
  );
};

export default ShowAllMembersPage;

const TableDataRows = ({ membersData }: { membersData: any }) => {
  if (membersData.length === 0) {
    return (
      <TableRow>
        <TableCell>No Members found</TableCell>
      </TableRow>
    );
  } else {
    return membersData.map((item: any) => {
      const expiryDate = new Date(item.expiry_date_time).toLocaleDateString();
      // calculate remaining days
      const remainingDays = Math.floor(
        (new Date(item.expiry_date_time).getTime() - new Date().getTime()) /
          (1000 * 3600 * 24)
      );
      return (
        <TableRow key={item.expiry_date_time}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{expiryDate}</TableCell>
          <TableCell>
            <p className="">{daysToYearsMonthsAndDays(remainingDays)}</p>
          </TableCell>
        </TableRow>
      );
    });
  }
};
