// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ✅ 우리가 사용하는 커스텀 필드
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
