"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { Heart } from "lucide-react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { useRouter } from "next/navigation";

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
      <div className="flex justify-center items-center h-screen bg-[#111827] text-white">
        <p className="text-[#D38B70]">불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#111827] text-center px-6 space-y-4">
        <div className="text-6xl mb-2 animate-bounce">🤎</div>
        <p className="text-[#FBBF77] text-2xl font-bold mb-4">로그인이 필요해요</p>
        <p className="text-gray-400 text-base leading-relaxed mb-4">
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
    <div className="min-h-screen bg-[#111827] text-white flex flex-col">
      <TopNav />

      <main className="flex-grow pt-24 pb-28 px-4 flex flex-col items-center">
      <button
        onClick={() => router.push("/likes/favorites")}
        className="w-full bg-[#B36B00] py-3 rounded-xl text-white font-semibold hover:bg-[#a35f00] transition"
      >
        내가 좋아요 누른 프로필 보기
      </button>
        <div className="text-center mb-6">
          
            <span className="text-m text-white">
              (서로 좋아요하면 채팅이 열려요!)
            </span>
          
        </div>

        {likedProfiles.length === 0 ? (
          <div className="text-center mt-10">
            
            <p className="text-m text-white leading-relaxed">
              아직 다른 사람들이 프로필이 등록되지 않았습니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {visibleProfiles.map((card) => (
              <div
                key={card.name}
                className="bg-[#1F2937] rounded-xl shadow-sm border border-[#2E3A4A] overflow-hidden"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 space-y-1 text-left">
                  <div className="text-sm font-semibold text-white">
                    {card.name}, {card.age}
                  </div>
                  <div className="text-xs text-gray-400">{card.mbti}</div>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#374151] text-gray-300 text-[10px] px-2 py-0.5 rounded-full"
                      >
                        #{tag}
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
            className="mt-6 text-[#FBBF77] underline text-sm"
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
