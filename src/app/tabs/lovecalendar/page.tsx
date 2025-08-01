"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import TopNav from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import { db, auth } from "../../firebase/firebaseConfig";

export default function LoveCalendarPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setHasProfile(false);
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().nickname) {
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    };
    checkProfile();
  }, [user]);

  if (hasProfile === null) {
    return <div className="min-h-screen bg-[#111827] text-white"><TopNav /><div className="pt-[72px] text-center mt-20">불러오는 중...</div></div>;
  }

  return (
    <div className="bg-[#111827] min-h-screen text-white pt-[72px] px-4 pb-20">
      <TopNav />
      <div className="max-w-md mx-auto mt-8 space-y-6">
        {hasProfile ? (
          <div className="space-y-4">
            <div className="bg-[#1F2937] p-6 rounded-xl text-center">
              <h1 className="text-lg font-bold">🎉 프로필이 등록되어 있어요!</h1>
              <p className="text-sm text-gray-400 mt-2">
                다른 사람의 프로필을 보려면 아래 버튼을 눌러주세요.
              </p>
            </div>
            <button
              onClick={() => router.push("/tabs/lovecalendar/browse")}
              className="w-full bg-[#B36B00] py-4 rounded-xl text-white font-semibold"
            >
              다른 사람 프로필 구경하기
            </button>
            <button
              onClick={() => router.push("/profile/edit")}
              className="w-full bg-[#374151] py-4 rounded-xl text-white font-semibold"
            >
              내 프로필 수정하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#374151] p-6 rounded-xl text-center">
              <h1 className="text-lg font-bold">먼저 내 프로필을 등록해주세요</h1>
              <p className="text-sm text-gray-400 mt-2">
                다른 사람 프로필을 보기 위해서는 본인의 프로필 등록이 필요해요 😊
              </p>
            </div>
            <button
              onClick={() => router.push("/tabs/lovecalendar/register")}
              className="w-full bg-[#B36B00] py-4 rounded-xl text-white font-semibold"
            >
              내 프로필 등록하기
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
