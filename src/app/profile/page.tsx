"use client";

import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] pt-20 pb-20 px-4">
      <TopNav />

      <div className="flex flex-col justify-center items-center text-center h-[calc(100vh-160px)]">
        <UserCircle size={72} strokeWidth={1.5} className="text-[#D38B70] mb-4" />
        <h2 className="text-lg font-semibold text-[#D38B70] mb-1">나무잎</h2>
        <p className="text-sm text-gray-500 mb-4">namuleaf@example.com</p>

        <button
          disabled
          className="bg-[#D38B70] text-white text-sm px-5 py-2 rounded-full cursor-not-allowed opacity-70 mb-6"
        >
          내 정보 수정하기 (준비중)
        </button>

        <h3 className="text-base font-semibold text-[#D38B70] mb-2">서비스 준비 중입니다</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          마이페이지 기능은 곧 오픈될 예정이에요!
          <br />
          조금만 기다려 주세요 💫
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
