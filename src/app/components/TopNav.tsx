// components/TopNav.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const router = useRouter();

  return (
    <header className="w-full bg-white border-b border-[#F5E9DA] px-6 py-4 flex justify-between items-center shadow-sm fixed top-0 left-0 right-0 z-50">
      <Link href="/">
  <h1 className="text-xl font-bold text-[#D38B70] cursor-pointer">Quokka</h1>
</Link>

      <button
        onClick={() => router.push("/login")}
        className="text-sm bg-[#D38B70] text-white px-4 py-1.5 rounded-full hover:bg-[#c5775e] transition"
      >
        로그인
      </button>
    </header>
  );
}
