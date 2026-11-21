import { timingSafeEqual } from "node:crypto";

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, signSessionToken, verifySessionToken, type AdminSession } from "./session";

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

export async function createAdminSession(email: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, await signSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
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
