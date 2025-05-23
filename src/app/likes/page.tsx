"use client";

import { Heart } from "lucide-react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";

export default function LikesPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFFDF9] px-4 text-center">
      <TopNav />

      <div className="flex flex-col justify-center items-center text-center h-[calc(100vh-160px)]">
        <Heart size={64} strokeWidth={1.5} className="text-[#D38B70] mb-6" />
      <h1 className="text-2xl font-bold text-[#D38B70] mb-2">서비스 준비 중입니다</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          좋아요 기능은 조금만 기다려 주세요!
          <br />
          더 나은 만남을 위해 열심히 준비하고 있어요 💗
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
 