"use client";

import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const MemberAttendanceTableBody = ({
  attnData,
}: {
  attnData: any[];
}) => {
  if (attnData.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell>No attendance found.</TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody>
      {attnData.map((item) => {
        return (
          <MemberAttendanceCheckRow
            key={item.attn_id}
            attnData={attnData}
            attnItem={item}
          />
        );
      })}
    </TableBody>
  );
};

const MemberAttendanceCheckRow = ({
  attnItem,
  attnData,
}: {
  attnItem: {
    user_id: number;
    attn_id: number;
  };
  attnData: any[];
}) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [memberData, setMemberData] = useState({
    name: "",
  });
  const [updating, setUpdating] = useState(false); // State to track whether an update is in progress

  const fetchMemberData = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", attnItem.user_id);
    // and also equals to current date
    if (error) {
      console.log(error);
      return;
    }
    setMemberData(data[0]);
  };

  useEffect(() => {
    fetchMemberData();

    const channel = supabase
      .channel("attendance_update")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();
  }, []);

  const handleAttendanceUpdate = async (action: "present" | "absent") => {
    if (updating) return; // Avoid multiple simultaneous updates
    setUpdating(true);
    try {
      if (action === "present") {
        // Optimistically update the UI
        alterAttendanceLocally(attnItem.attn_id, "present");
        // Update attendance table on the server
        const { data, error } = await supabase
          .from("attendance")
          .update({ status: "TRUE" })
          .eq("attn_id", attnItem.attn_id);
        if (error) {
          console.log(error);
          // Rollback the UI update in case of an error
          alterAttendanceLocally(attnItem.attn_id, "absent");
        }
      } else {
        // Optimistically update the UI
        alterAttendanceLocally(attnItem.attn_id, "absent");
        // Update attendance table on the server
        const { data, error } = await supabase
          .from("attendance")
          .delete()
          .eq("attn_id", attnItem.attn_id);
        if (error) {
          console.log(error);
          // Rollback the UI update in case of an error
          alterAttendanceLocally(attnItem.attn_id, "present");
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  const alterAttendanceLocally = (id: number, action: "present" | "absent") => {
    // Update the UI optimistically by filtering the attnData array
    const updatedData = attnData.filter((item: any) => item.attn_id !== id);
    setMemberData((prevData) => {
      return {
        ...prevData,
        name: updatedData,
      };
    });
  };

  return (
    <TableRow>
      <TableCell>{memberData.name}</TableCell>
      <TableCell>
        <Button
          onClick={() => handleAttendanceUpdate("present")}
          className="p-1 bg-green-400 text-white rounded-md"
        >
          {/* Approve */}
          {/* right tick mark */}
          <svg
            fill="#ffffff"
            width="30px"
            height="30px"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z" />
          </svg>
        </Button>
      </TableCell>
      <TableCell>
        <Button
          onClick={() => handleAttendanceUpdate("absent")}
          className="px-2 py-1 bg-red-400 text-white rounded-md"
        >
          {/* Cancel */}
          {/* cancel mark */}
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <title>cancel</title>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                id="work-case"
                fill="#ffffff"
                transform="translate(91.520000, 91.520000)"
              >
                <polygon
                  id="Close"
                  points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48"
                ></polygon>
              </g>
            </g>
          </svg>
        </Button>
      </TableCell>
    </TableRow>
  );
};

// const alterAttendance = async (
//   id: number,
//   action: "present" | "absent",
//   supabase: any
// ) => {
//   if (action === "present") {
//     // update attendance table
//     const { data, error } = await supabase
//       .from("attendance")
//       .update({ status: "TRUE" })
//       .eq("attn_id", id);
//     if (error) {
//       console.log(error);
//       return;
//     }
//   } else {
//     // update attendance table
//     const { data, error } = await supabase
//       .from("attendance")
//       .delete()
//       .eq("attn_id", id);
//     if (error) {
//       console.log(error);
//       return;
//     }
//   }
// };
