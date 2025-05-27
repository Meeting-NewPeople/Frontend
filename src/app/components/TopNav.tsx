"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 추가
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // ✅ 로딩 끝
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("로그아웃하시겠습니까?");
    if (!confirmLogout) return;
  
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#F5E9DA] px-6 py-4 flex justify-between items-center shadow-sm fixed top-0 left-0 right-0 z-50">
      <Link href="/">
        <h1 className="text-xl font-bold text-[#D38B70] cursor-pointer">Quokka</h1>
      </Link>

      {/* 👇 로딩 중일 땐 아무 것도 안 보여줌 */}
      {!isLoading && (
        user ? (
          <button
            onClick={handleLogout}
            className="text-sm bg-[#D38B70] text-white px-4 py-1.5 rounded-full hover:bg-[#c5775e] transition"
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-sm bg-[#D38B70] text-white px-4 py-1.5 rounded-full hover:bg-[#c5775e] transition"
          >
            로그인
          </button>
        )
      )}
    </header>
  );
}
