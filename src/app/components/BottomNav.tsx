// components/BottomNav.tsx
"use client";

import { Home, MessageSquare, Heart, User } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md px-6 py-2 flex justify-around z-50">
      <button className="flex flex-col items-center text-[#B36B00]">
        <Home size={24} />
        <span className="text-xs mt-1">홈</span>
      </button>
      <button className="flex flex-col items-center text-[#B36B00]">
        <MessageSquare size={24} />
        <span className="text-xs mt-1">채팅</span>
      </button>
      <button className="flex flex-col items-center text-[#B36B00]">
        <Heart size={24} />
        <span className="text-xs mt-1">좋아요</span>
      </button>
      <button className="flex flex-col items-center text-[#B36B00]">
        <User size={24} />
        <span className="text-xs mt-1">프로필</span>
      </button>
    </nav>
  );
}
