"use client";

import { usePathname } from "next/navigation";
import { Map, GraduationCap, Heart, User } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isCurrent = isActive("/lovecalendar") || isActive("/likes");
  
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#1E1E1E] border-t border-gray-200 shadow-md px-6 py-2 flex justify-around z-50 ">
      <Link href="/tabs/foodmap" className="flex flex-col items-center text-[#ffffff]">
        <Map
          size={24}
          fill={isActive("/tabs/foodmap") ? "#ffffff" : "none"}
          stroke="#ffffff"
        />
        <span className={`text-xs mt-1 ${isActive("/foodmap") ? "font-bold" : ""}`}>
          맛집지도
        </span>
      </Link>

      <Link href="/tabs/mentor" className="flex flex-col items-center text-[#ffffff]">
        <GraduationCap
          size={24}
          fill={isActive("/tabs/mentor") ? "#ffffff" : "none"}
          stroke="#ffffff"
        />
        <span className={`text-xs mt-1 ${isActive("/mentor") ? "font-bold" : ""}`}>
          대학멘토
        </span>
      </Link>

      <Link href="/tabs/lovecalendar" className="flex flex-col items-center text-[#ffffff]">
        <Heart
          size={24}
          fill={isActive("/tabs/lovecalendar") || isActive("/likes") ? "#ffffff" : "none"}
          stroke="#ffffff"
        />
        <span className={`text-xs mt-1 ${isActive("/tabs/lovecalendar") || isActive("/likes") ? "font-bold" : ""}`}>
          러브캘린더
        </span>
      </Link>

      <Link href="/tabs/profile" className="flex flex-col items-center text-[#ffffff]">
        <User
          size={24}
          fill={isActive("/profile") ? "#B36B00" : "none"}
          stroke="#ffffff"
        />
        <span className={`text-xs mt-1 ${isActive("/profile") ? "font-bold" : ""}`}>
          프로필
        </span>
      </Link>
    </nav>
  );
}
