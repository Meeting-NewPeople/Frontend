"use client";

import { usePathname } from "next/navigation";
import { Map, GraduationCap, Heart, User } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md px-6 py-2 flex justify-around z-50">
      <Link href="/tabs/foodmap" className="flex flex-col items-center text-[#B36B00]">
        <Map
          size={24}
          fill={isActive("/foodmap") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span className={`text-xs mt-1 ${isActive("/foodmap") ? "font-bold" : ""}`}>
          맛집지도
        </span>
      </Link>

      <Link href="/tabs/mentor" className="flex flex-col items-center text-[#B36B00]">
        <GraduationCap
          size={24}
          fill={isActive("/mentor") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span className={`text-xs mt-1 ${isActive("/mentor") ? "font-bold" : ""}`}>
          대학멘토
        </span>
      </Link>

      <Link href="/tabs/lovecalendar" className="flex flex-col items-center text-[#B36B00]">
        <Heart
          size={24}
          fill={isActive("/lovecalendar") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span className={`text-xs mt-1 ${isActive("/lovecalendar") ? "font-bold" : ""}`}>
          러브캘린더
        </span>
      </Link>

      <Link href="/tabs/profile" className="flex flex-col items-center text-[#B36B00]">
        <User
          size={24}
          fill={isActive("/profile") ? "#B36B00" : "none"}
          stroke="#B36B00"
        />
        <span className={`text-xs mt-1 ${isActive("/profile") ? "font-bold" : ""}`}>
          프로필
        </span>
      </Link>
    </nav>
  );
}
