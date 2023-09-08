export const dynamic = "force-dynamic";

export const metadata = {
  title: "NFP - Admin Portal",
  description: "Admin Portal",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}
