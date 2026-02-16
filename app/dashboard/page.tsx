import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (!role) {
    redirect("/");
  }

  if (role === "student") {
    redirect("/dashboard/student");
  }

  if (role === "printer") {
    redirect("/dashboard/printer");
  }

  redirect("/");
}
