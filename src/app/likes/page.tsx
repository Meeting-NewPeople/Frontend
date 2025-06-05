"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig"; // Firebase 초기화 파일
import { Heart } from "lucide-react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { cards } from "../components/data/cards";

   

export default function LikesPage() {
  const [user, loading] = useAuthState(auth);

  const [likedProfiles, setLikedProfiles] = useState<typeof cards>([]);
  
  const handleLike = async (cardName: string) => {
    if (!user) return;
  
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        likedProfiles: arrayUnion(cardName), // 누른 이름 추가
      });
      alert(`${cardName}님에게 좋아요를 눌렀어요!`);
    } catch (error) {
      console.error("좋아요 저장 실패", error);
    }
  };
  

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) return;
  
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const likedNames = docSnap.data().likedProfiles || [];
        const filtered = cards.filter((card) =>
          likedNames.includes(card.name)
        );
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#D38B70]">로그인이 필요합니다</p>
      </div>
    );
  }

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
            {likedProfiles.map((card) => (
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
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
