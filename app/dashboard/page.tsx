"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      router.push("/");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  useEffect(() => {
    if (role === "student") {
      router.push("/dashboard/student");
    }
    if (role === "printer") {
      router.push("/dashboard/printer");
    }
  }, [role, router]);

  return null;
}

