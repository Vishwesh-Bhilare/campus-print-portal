import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const studentId = formData.get("studentId") as string;
    const copies = Number(formData.get("copies"));
    const color = formData.get("color") as string;

    if (!file || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filePath = `${studentId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("prints")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("prints")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from("print_requests")
      .insert([
        {
          student_id: studentId,
          file_url: publicUrlData.publicUrl,
          copies,
          color,
          status: "pending",
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
