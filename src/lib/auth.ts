import { timingSafeEqual } from "node:crypto";

import { compare } from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifySessionToken,
  type AdminSession,
} from "./session";

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

/**
 * Valida as credenciais contra as variáveis de ambiente.
 * Se `ADMIN_PASSWORD_HASH` existir (bcrypt), ele tem prioridade sobre
 * `ADMIN_PASSWORD` em texto puro.
 */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail) {
    console.error("ADMIN_EMAIL não configurado.");
    return false;
  }

  if (!safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase())) {
    return false;
  }

  if (adminPasswordHash) {
    try {
      return await compare(password, adminPasswordHash);
    } catch (error) {
      console.error("Falha ao validar ADMIN_PASSWORD_HASH:", error);
      return false;
    }
  }

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD ou ADMIN_PASSWORD_HASH não configurados.");
    return false;
  }

  return safeEqual(password, adminPassword);
}

/**
 * O atributo `Secure` só pode ser usado quando a página é servida por HTTPS.
 * Em produção acessada por HTTP (ex.: `http://192.168.0.10:3000` na LAN), o
 * navegador descarta o cookie e a sessão se perde a cada navegação.
 *
 * Ordem de decisão:
 * 1. `COOKIE_SECURE` (override explícito: "true" | "false");
 * 2. `x-forwarded-proto` (quando há proxy reverso/Nginx);
 * 3. protocolo de `NEXT_PUBLIC_SITE_URL`;
 * 4. fallback para o comportamento antigo (Secure em produção).
 */
async function shouldUseSecureCookie(): Promise<boolean> {
  const override = process.env.COOKIE_SECURE?.toLowerCase();

  if (override === "true") {
    return true;
  }

  if (override === "false") {
    return false;
  }

  try {
    const headerList = await headers();
    const forwardedProto = headerList
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim()
      .toLowerCase();

    if (forwardedProto) {
      return forwardedProto === "https";
    }
  } catch {
    // Sem contexto de request (ex.: testes): segue para o fallback.
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl) {
    return siteUrl.startsWith("https://");
  }

  return process.env.NODE_ENV === "production";
}

export async function createAdminSession(email: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, await signSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: await shouldUseSecureCookie(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

/** Usado nos layouts protegidos do /admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
