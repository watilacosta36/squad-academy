import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Healthcheck usado pelo Docker Compose e por monitoramento. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: "ok",
      database: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Healthcheck falhou:", error);

    return Response.json(
      { status: "error", database: "unavailable" },
      { status: 503 },
    );
  }
}
