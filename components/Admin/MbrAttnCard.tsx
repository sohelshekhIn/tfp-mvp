"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MemberAttendanceCard = ({ item }: { item: any }) => {
  const supabase = createClientComponentClient();
  const [memberData, setMemberData] = useState<any>({
    name: "",
  });
  const router = useRouter();

  const getData = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", item.user_id);
    // and also equals to current date
    if (error) {
      console.log(error);
      return;
    }

    setMemberData(data[0]);
  };
  // get name os member from member table using user_id
  useEffect(() => {
    getData();

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

  const removeAttendance = async (id: number) => {
    // remove attendance from attendance table
    const { data, error } = await supabase
      .from("attendance")
      .delete()
      .eq("attn_id", id);
    if (error) {
      console.log(error);
      return;
    }
    // router.refresh();
  };

  const markAttendance = async (id: number) => {
    // update status in attendance table with id
    const { data, error } = await supabase
      .from("attendance")
      .update({ status: "TRUE" })
      .eq("attn_id", id)

      .select();
    if (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className="flex justify-between text-sm items-center p-2 border-b border-gray-300/50">
      <p className="text-gray-700">{memberData.name}</p>
      {/* cancel and approve button */}
      <div className="flex gap-2">
        <Button
          onClick={() => markAttendance(item.attn_id)}
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
        <Button
          onClick={() => removeAttendance(item.attn_id)}
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
      </div>
    </div>
  );
};

export default MemberAttendanceCard;
