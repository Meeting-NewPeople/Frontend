"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { Heart } from "lucide-react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { cards } from "../components/data/cards";
import { useRouter } from "next/navigation";

export default function LikesPage() {
  const [user, loading] = useAuthState(auth);
  const [likedProfiles, setLikedProfiles] = useState<typeof cards>([]);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const likedNames = docSnap.data().likedUsers || []; // 🔑 여기 필드명 맞춤
        const filtered = cards.filter((card) => likedNames.includes(card.name));
        setLikedProfiles(filtered);
      }
    };

    fetchLikes();
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
  
        <p className="text-[#B36B00] text-2xl font-bold mb-4">
  로그인이 필요해요
</p>

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
  
  
  const visibleProfiles = showAll ? likedProfiles : likedProfiles.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <TopNav />

      <main className="flex-grow pt-24 pb-28 px-4 flex flex-col items-center">
        {likedProfiles.length === 0 ? (
          <div className="text-center mt-20">
            <Heart size={64} strokeWidth={1.5} className="text-[#D38B70] mb-6" />
            <h1 className="text-2xl font-bold text-[#D38B70] mb-2">
              좋아요를 누른 사람이 아직 없습니다
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              마음에 드는 프로필을 눌러보세요!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 w-full max-w-md">
            {visibleProfiles.map((card) => (
              <div
                key={card.name}
                className="bg-[#FFF9F2] w-full rounded-3xl shadow-md border border-[#F5E9DA] overflow-hidden"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 space-y-2 text-left">
                  <div className="text-lg font-semibold text-[#4B2E2E]">
                    {card.name}, {card.age}
                  </div>
                  <div className="text-sm text-[#8A6E5A]">
                    {card.location} · {card.mbti}
                  </div>
                  <div className="text-sm text-[#8A6E5A]">{card.school}</div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#FFEEDB] text-[#B36B00] text-xs px-3 py-1 rounded-full shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[#5E4A3B] pt-1">{card.bio}</p>
                </div>
              </div>
            ))}

            {likedProfiles.length > 3 && (
              <button
                className="mt-6 text-[#B36B00] underline text-sm"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "접기" : "더보기"}
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
