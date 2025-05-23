// src/app/chat/page.tsx
"use client";

import { MessageCircle } from "lucide-react";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFFDF9] px-4 text-center">
      <TopNav />
      
      <MessageCircle size={64} className="text-[#D38B70] mb-4" />
      <h1 className="text-2xl font-bold text-[#D38B70] mb-2">서비스 준비 중입니다</h1>
      <p className="text-sm text-gray-500">
        채팅 기능은 조금만 기다려 주세요!  
        <br />더 나은 만남을 위해 열심히 준비하고 있어요 💬
      </p>
      <BottomNav />
    </div>
  );
}
