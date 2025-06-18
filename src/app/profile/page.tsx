"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@headlessui/react";
import { ChevronRight } from "lucide-react";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function ProfilePage() {
  const [matching, setMatching] = useState(true);
  const router = useRouter();
  const { user } = useAuth(); // ✅ 현재 로그인 유저 가져오기

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃되었습니다.");
      router.refresh(); // 새로고침으로 상태 반영
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-[#FFFDF9] flex flex-col pt-20 pb-12">
        <div className="flex justify-center flex-grow">
          <div className="w-full max-w-md min-h-full bg-[#F6F6F6] flex flex-col rounded-xl shadow p-6 mb-6 mx-4 space-y-6">
            <h2 className="text-lg font-bold">내 프로필</h2>

            {/* ✅ 로그인 여부에 따라 버튼 표시 */}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-[#D38B70] text-white font-semibold py-3 rounded-2xl text-base shadow"
              >
                로그아웃하기
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-[#D38B70] text-white font-semibold py-3 rounded-2xl text-base shadow"
              >
                로그인하기
              </button>
            )}

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
