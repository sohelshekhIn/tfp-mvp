import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import MarkAttnBtn from "@/components/Member/MarkAttnBtn";
import { getLocalTimeString } from "@/lib/utils";
const MemberIndex = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", getLocalTimeString())
    .eq("user_id", user?.id);

  if (error) {
    console.log(error);
    return;
  }

  return (
    <div className="py-3">
      <h1 className="text-gray-700 font-semibold text-lg">
        Welcome back, {user?.user_metadata.name.split(" ")[0]}
      </h1>
      <div className="py-4">
        <MarkAttnBtn data={data} />
      </div>
    </div>
  );
};

export default MemberIndex;
