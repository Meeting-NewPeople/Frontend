"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase/firebaseConfig";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// 🔸 유저 타입 정의
type UserData = {
  nickname: string;
  age: number;
  mbti: string;
  location?: string;
  tags?: string[];
  image?: string;
  bio?: string;
  likedUsers?: string[];
};

export default function ChatPage() {
  const [user, loading] = useAuthState(auth);
  const [mutuals, setMutuals] = useState<UserData[]>([]);
  const [myData, setMyData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMutualLikes = async () => {
      if (!user) return;

      const myDoc = await getDoc(doc(db, "users", user.uid));
      if (!myDoc.exists()) return;

      const myData = myDoc.data() as UserData;
      setMyData(myData);

      const myLikes: string[] = myData.likedUsers || [];

      const usersSnap = await getDocs(collection(db, "users"));
      const mutuals: UserData[] = [];

      usersSnap.forEach((docSnap) => {
        const data = docSnap.data() as UserData;
        if (
          data.nickname &&
          myLikes.includes(data.nickname) &&
          data.likedUsers?.includes(myData.nickname)
        ) {
          mutuals.push(data);
        }
      });

      setMutuals(mutuals);
    };

    fetchMutualLikes();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-[#FFF3E6] to-[#FFEAD8] text-center px-6 space-y-4">
        <div className="text-6xl mb-2 animate-bounce">🤎</div>
        <p className="text-[#B36B00] text-2xl font-bold mb-4">로그인이 필요해요</p>
        <p className="text-[#8A6E5A] text-base leading-relaxed mb-4">
  매칭 기능을 이용하려면 <br />먼저 로그인해주세요
  <br />
  <span className="text-sm text-[#A27C68]">
    (서로 좋아요를 누르면 매칭돼요!)
  </span>
</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-[#D38B70] text-white px-6 py-2 rounded-xl hover:bg-[#b7745a] transition mt-2"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <TopNav />

      <main className="flex-grow pt-24 pb-28 px-4">
      <div className="text-center mb-6">
    <p className="text-[#8A6E5A] text-base leading-relaxed">
      매칭된 사용자와 채팅할 수 있어요 💬
      <br />
      <span className="text-sm text-[#A27C68]">
        (서로 좋아요를 누르면 매칭돼요!)
      </span>
    </p>
  </div>
        {loading || !myData ? (
          <div className="text-center text-[#B36B00] mt-20">불러오는 중...</div>
        ) : mutuals.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-20">
            <MessageCircle size={64} className="text-[#D38B70] mb-4" />
            <h1 className="text-2xl font-bold text-[#D38B70] mb-2">아직 채팅 상대가 없습니다!</h1>
            <p className="text-sm text-gray-500">
              서로 좋아요를 누르면 <br /> 채팅할 수 있어요 💬
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {mutuals.map((user) => (
              <div
                key={user.nickname}
                className="bg-white rounded-xl shadow border border-[#F1E8DC] overflow-hidden cursor-pointer"
                onClick={() => {
                  alert(`${user.nickname}님과의 채팅으로 이동합니다`);
                  setTimeout(() => {
                    router.push(`/chat/${user.nickname}`);
                  }, 100);
                }}
              >
                <img
                  src={user.image || "/default-profile.png"}
                  alt={user.nickname}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 text-left">
                  <div className="text-sm font-semibold text-[#4B2E2E]">{user.nickname}</div>
                  <div className="text-xs text-[#8A6E5A]">{user.mbti} · {user.age}세</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
