"use client";

import { usePathname } from "next/navigation";
import { Home, MessageSquare, Heart, User } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md px-6 py-2 flex justify-around z-50">
      <Link href="/" className="flex flex-col items-center text-[#B36B00]">
        <Home
          size={24}
          fill={isActive("/") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span
          className={`text-xs mt-1 ${
            isActive("/") ? "font-bold text-[#B36B00]" : "text-[#B36B00]"
          }`}
        >
          홈
        </span>
      </Link>

      <Link href="/chat" className="flex flex-col items-center text-[#B36B00]">
        <MessageSquare
          size={24}
          fill={isActive("/chat") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span
          className={`text-xs mt-1 ${
            isActive("/chat") ? "font-bold text-[#B36B00]" : "text-[#B36B00]"
          }`}
        >
          채팅
        </span>
      </Link>

      <Link href="/likes" className="flex flex-col items-center text-[#B36B00]">
        <Heart
          size={24}
          fill={isActive("/likes") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span
          className={`text-xs mt-1 ${
            isActive("/likes") ? "font-bold text-[#B36B00]" : "text-[#B36B00]"
          }`}
        >
          좋아요
        </span>
      </Link>

      <Link href="/profile" className="flex flex-col items-center text-[#B36B00]">
        <User
          size={24}
          fill={isActive("/profile") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span
          className={`text-xs mt-1 ${
            isActive("/profile") ? "font-bold text-[#B36B00]" : "text-[#B36B00]"
          }`}
        >
          프로필
        </span>
      </Link>
    </nav>
  );
}
