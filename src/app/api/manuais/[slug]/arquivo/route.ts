import {
  getPublishedManualBySlug,
  incrementManualDownloads,
} from "@/lib/data/manuals";
import { readUpload } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * Entrega o PDF do manual contando o acesso.
 * `?modo=visualizar` (padrão) abre inline; `?modo=baixar` força o download.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const mode =
    new URL(request.url).searchParams.get("modo") === "baixar"
      ? "baixar"
      : "visualizar";

  const manual = await getPublishedManualBySlug(slug);

  if (!manual) {
    return Response.json(
      { error: "Manual não encontrado ou não publicado." },
      { status: 404 },
    );
  }

  const localFile = await readUpload(manual.pdfUrl);
  const isRemote = /^https?:\/\//.test(manual.pdfUrl);

  if (!localFile && !isRemote) {
    return Response.json(
      { error: "Arquivo do manual indisponível." },
      { status: 404 },
    );
  }

  await incrementManualDownloads(slug);

  const safeName = slug.replace(/[^a-zA-Z0-9-_]/g, "-");
  const disposition = `${
    mode === "baixar" ? "attachment" : "inline"
  }; filename="${safeName}.pdf"`;

  if (localFile) {
    const body = localFile.buffer.slice(
      localFile.byteOffset,
      localFile.byteOffset + localFile.byteLength,
    ) as ArrayBuffer;

    return new Response(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(localFile.byteLength),
        "Content-Disposition": disposition,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  }

  // Vercel Blob: redireciona para a URL pública (o download força o anexo).
  const target =
    mode === "baixar"
      ? `${manual.pdfUrl}${manual.pdfUrl.includes("?") ? "&" : "?"}download=1`
      : manual.pdfUrl;

  return Response.redirect(target, 302);
}
