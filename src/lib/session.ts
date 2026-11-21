import { SignJWT, jwtVerify } from "jose";

/**
 * Sessão do admin via JWT assinado (HS256) em cookie httpOnly.
 * Este módulo é seguro para o `proxy.ts` (não importa bcrypt nem `next/headers`).
 */

export const SESSION_COOKIE = "squad_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

export type AdminSession = {
  email: string;
};

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET ausente ou muito curto. Defina um valor aleatório no .env.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    const email = typeof payload.email === "string" ? payload.email : null;

    return email ? { email } : null;
  } catch {
    return null;
  }
}
