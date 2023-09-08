export const dynamic = "force-dynamic";

export const metadata = {
  title: "NFP - Member Portal",
  description: "Member Portal",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-6">{children}</div>
    </>
  );
}
