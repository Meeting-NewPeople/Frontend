"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user || loading) return;
      if (
        pathname.startsWith("/profile/require") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup")
      ) {
        return; // 로그인/회원가입/프로필등록 페이지는 제외
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        router.replace("/profile/require"); // ✅ 프로필 등록 안내로 이동
      }
    };

    checkUserProfile();
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}
