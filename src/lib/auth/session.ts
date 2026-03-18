import { getAuthCookies } from "./cookies";
import { verifyAccessToken, verifyRefreshToken, type TokenPayload } from "./jwt";

export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: "admin" | "dispatcher" | "driver" | "warehouse";
  };
}

export async function getSession(): Promise<Session | null> {
  const { accessToken, refreshToken } = await getAuthCookies();

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      return toSession(payload);
    }
  }

  if (refreshToken) {
    const refreshPayload = verifyRefreshToken(refreshToken);
    if (refreshPayload) {
      return toSession({
        id: refreshPayload.id,
        email: refreshPayload.email || "",
        name: refreshPayload.name || "",
        image: refreshPayload.image,
        role: refreshPayload.role || "dispatcher",
      });
    }
  }

  return null;
}

function toSession(payload: Pick<TokenPayload, "id" | "email" | "name" | "image" | "role">): Session {
  return {
    user: {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      image: payload.image,
      role: payload.role || "dispatcher",
    },
  };
}
