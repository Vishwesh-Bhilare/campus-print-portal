import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function addWatermarkToPDF(
  fileBuffer: ArrayBuffer,
  uid: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();

    page.drawText(uid, {
      x: width - 120,
      y: height - 20,
      size: 10,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });
  });

  return await pdfDoc.save();
}
