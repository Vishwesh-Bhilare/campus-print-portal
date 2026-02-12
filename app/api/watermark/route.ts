import { NextRequest, NextResponse } from "next/server";
import {
  PDFDocument,
  rgb,
  StandardFonts,
  PDFPage,
} from "pdf-lib";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const uid = formData.get("uid") as string;

    if (!file || !uid) {
      return NextResponse.json(
        { error: "File and UID are required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF watermarking is supported" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages: PDFPage[] = pdfDoc.getPages();

    pages.forEach((page: PDFPage) => {
      const { width, height } = page.getSize();

      page.drawText(uid, {
        x: width - 120,
        y: height - 20,
        size: 10,
        font,
        color: rgb(0.6, 0.6, 0.6),
      });
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=watermarked.pdf",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Watermarking failed" },
      { status: 500 }
    );
  }
}
