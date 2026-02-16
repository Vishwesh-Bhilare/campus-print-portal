import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { addWatermarkToPDF } from "@/lib/watermark";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get("role")?.value;

    if (role !== "student") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const copies = Number(formData.get("copies"));
    const color = formData.get("color") as string;

    if (!file || !copies || !color) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Fetch student UID
    const { data: student } = await supabase
      .from("students")
      .select("uid")
      .eq("id", user.id)
      .single();

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    let finalFileBuffer: Uint8Array;

    if (file.type === "application/pdf") {
      finalFileBuffer = await addWatermarkToPDF(
        buffer,
        student.uid
      );
    } else {
      finalFileBuffer = new Uint8Array(buffer);
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("prints")
      .upload(filePath, finalFileBuffer, {
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("prints")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from("print_requests")
      .insert({
        student_id: user.id,
        file_url: publicUrl,
        copies,
        color,
        status: "pending",
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
