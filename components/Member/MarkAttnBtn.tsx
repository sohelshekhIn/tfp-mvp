"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getLocalTimeString } from "@/lib/utils";

const MarkAttnBtn = ({ data }: { data: any }) => {
  const supabase = createClientComponentClient();
  const [attendanceDone, setAttendanceDone] = useState(true);

  useEffect(() => {
    if (data.length === 0) {
      setAttendanceDone(false);
    }
  }, [data]);

  const markAttendance = async () => {
    if (attendanceDone) {
      return;
    }
    setAttendanceDone(true);

    // get uuid of current user
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("attendance")
      .insert([{ user_id: user.user?.id, date: getLocalTimeString() }]);
    if (error) {
      console.log(error);
      return;
    }
  };

  return (
    <Button onClick={markAttendance} disabled={attendanceDone}>
      Mark Attendance
    </Button>
  );
};

export default MarkAttnBtn;
