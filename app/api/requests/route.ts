import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get("role")?.value;

    if (!role) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // STUDENT → only own requests
    if (role === "student") {
      const authHeader = cookieStore.get("sb-access-token")?.value;

      if (!authHeader) {
        return NextResponse.json([], { status: 200 });
      }

      const {
        data: { user },
      } = await supabase.auth.getUser(authHeader);

      if (!user) {
        return NextResponse.json([], { status: 200 });
      }

      const { data, error } = await supabase
        .from("print_requests")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return NextResponse.json(data || []);
    }

    // PRINTER → all requests
    if (role === "printer") {
      const { data, error } = await supabase
        .from("print_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return NextResponse.json(data || []);
    }

    return NextResponse.json([], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
