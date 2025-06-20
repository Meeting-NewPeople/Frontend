"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { signOut, deleteUser, User } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export default function ProfilePage() {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user: User | null = auth.currentUser;
      if (user) {
        setIsLoggedIn(true);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNickname(data.nickname || "익명");
          setProfileImage(data.image?.trim() || "/default-profile.png");
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      alert("로그아웃되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const reason = prompt("탈퇴 사유를 입력해주세요 (필수):");
    if (!reason || reason.trim() === "") {
      alert("탈퇴 사유를 입력하셔야 합니다.");
      return;
    }

    try {
      // Firestore 유저 정보 삭제
      await deleteDoc(doc(db, "users", user.uid));

      // Firebase Auth 유저 삭제
      await deleteUser(user);

      alert("회원 탈퇴가 완료되었습니다.");
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        alert("최근 로그인 정보가 필요합니다. 다시 로그인 후 시도해주세요.");
        router.push("/login");
      } else {
        console.error("탈퇴 오류:", error);
        alert("탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-[#FFFDF9] flex flex-col pt-20 pb-12">
        <div className="flex justify-center flex-grow">
          <div className="w-full max-w-md min-h-full bg-[#F6F6F6] flex flex-col rounded-xl shadow p-6 mb-6 mx-4 space-y-6">
            <h2 className="text-lg font-bold">내 프로필</h2>

            {/* 👤 간단한 프로필 정보 */}
            {isLoggedIn && (
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div className="text-base text-gray-800 font-semibold">{nickname} 님</div>
                </div>
                <button
                  onClick={() => router.push("/profile/edit")}
                  className="text-[#D38B70] text-sm underline hover:opacity-80 transition whitespace-nowrap"
                >
                  ✏️ 프로필 수정
                </button>
              </div>
            )}

            {/* 🔐 로그인 버튼 */}
            {isLoggedIn ? (
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

            {/* 🔧 설정 */}
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200 overflow-hidden">
              {[
                { label: "고객센터", path: "" },
                { label: "자주 묻는 질문 (FAQ)", path: "/profile/faq" },
                { label: "이용약관", path: "" },
                { label: "개인정보처리방침", path: "" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-4 py-4 text-sm hover:bg-gray-50 transition"
                  onClick={() => item.path && router.push(item.path)}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} className="text-[#C2B4A6]" />
                </button>
              ))}
            </div>

            {/* 🗑️ 회원 탈퇴 */}
            {isLoggedIn && (
              <button
                onClick={handleDeleteAccount}
                className="w-full text-center mt-4 text-sm text-red-500 underline hover:opacity-80 transition"
              >
                회원 탈퇴하기
              </button>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </>
  );
}
