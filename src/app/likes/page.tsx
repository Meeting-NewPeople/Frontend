"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { Heart } from "lucide-react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { useRouter } from "next/navigation";

// 🔸 타입 정의
type ProfileCard = {
  name: string;
  age: number;
  mbti: string;
  location: string;
  tags: string[];
  image: string;
};

export default function LikesPage() {
  const [user, loading] = useAuthState(auth);
  const [likedProfiles, setLikedProfiles] = useState<ProfileCard[]>([]);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;

      const likedNames = userDoc.data().likedUsers || [];

      const querySnapshot = await getDocs(collection(db, "users"));
      const loadedCards: ProfileCard[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (likedNames.includes(data.nickname)) {
          loadedCards.push({
            name: data.nickname,
            age: data.age,
            mbti: data.mbti,
            location: data.location,
            tags: data.tags || [],
            image: data.image || "/default-profile.png",
          });
        }
      });

      setLikedProfiles(loadedCards);
    };

    fetchLikedProfiles();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#D38B70]">불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-[#FFF3E6] to-[#FFEAD8] text-center px-6 space-y-4">
        <div className="text-6xl mb-2 animate-bounce">🤎</div>
        <p className="text-[#B36B00] text-2xl font-bold mb-4">로그인이 필요해요</p>
        <p className="text-[#8A6E5A] text-base leading-relaxed mb-4">
          좋아요한 프로필을 확인하려면<br />먼저 로그인해주세요
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

  const visibleProfiles = showAll ? likedProfiles : likedProfiles.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <TopNav />

      <main className="flex-grow pt-24 pb-28 px-4 flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-[#8A6E5A] text-base leading-relaxed">
            내가 좋아요를 누른 프로필들이에요 🤎
            <br />
            <span className="text-sm text-[#A27C68]">
              (서로 좋아요하면 채팅이 열려요!)
            </span>
          </p>
        </div>

        {likedProfiles.length === 0 ? (
          <div className="text-center mt-10">
            <Heart size={64} strokeWidth={1.5} className="text-[#D38B70] mb-6" />
            <h1 className="text-2xl font-bold text-[#D38B70] mb-2">
              좋아요를 누른 사람이 아직 없습니다
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              마음에 드는 프로필을 눌러보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {visibleProfiles.map((card) => (
              <div
                key={card.name}
                className="bg-white rounded-xl shadow-sm border border-[#F1E8DC] overflow-hidden"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 space-y-1 text-left">
                  <div className="text-sm font-semibold text-[#4B2E2E]">
                    {card.name}, {card.age}
                  </div>
                  <div className="text-xs text-[#8A6E5A]">{card.mbti}</div>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#FFF1E0] text-[#B36B00] text-[10px] px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {likedProfiles.length > 6 && (
          <button
            className="mt-6 text-[#B36B00] underline text-sm"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "접기" : "더보기"}
          </button>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
