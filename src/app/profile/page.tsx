"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@headlessui/react";
import { ChevronRight } from "lucide-react";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";

export default function ProfilePage() {
  const [matching, setMatching] = useState(true);
  const router = useRouter();

  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-[#FFFDF9] flex flex-col pt-20 pb-12">
        <div className="flex justify-center flex-grow">
          <div className="w-full max-w-md min-h-full bg-[#F6F6F6] flex flex-col rounded-xl shadow p-6 mb-6 mx-4 space-y-6">

            <h2 className="text-lg font-bold">내 프로필</h2>

            {/* 🔽 로그인 버튼에 onClick 추가 */}
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#D38B70] text-white font-semibold py-3 rounded-2xl text-base shadow"
            >
              로그인하기
            </button>

            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm">매칭 참여</span>
                <Switch
                  checked={matching}
                  onChange={setMatching}
                  className={`${
                    matching ? "bg-[#D38B70]" : "bg-gray-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                >
                  <span
                    className={`${
                      matching ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </div>

              {[
                "고객센터",
                "자주 묻는 질문 (FAQ)",
                "이용약관",
                "개인정보처리방침",
              ].map((item) => (
                <button
                  key={item}
                  className="w-full flex items-center justify-between px-4 py-4 text-sm hover:bg-gray-50 transition"
                >
                  <span>{item}</span>
                  <ChevronRight size={16} className="text-[#C2B4A6]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </>
  );
}
