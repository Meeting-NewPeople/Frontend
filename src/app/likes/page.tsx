"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";

// 예시 카드 데이터 (공통 파일로 분리 추천)
const cards = [
  {
    name: "나무잎",
    age: 23,
    location: "서울 은평구",
    mbti: "ENTJ",
    school: "성균관대학교",
    tags: ["학업", "등산", "헬스", "요리하기"],
    bio: "아기자기한 카페를 좋아하고, 맛집 가는 거 좋아하고, 운동도 좋아해요. 03년생입니다! 매칭 요청해주시고, 오픈채팅 쿼카 나무잎으로 와주세요.",
    image: "/picture1.jpg",
  },
  {
    name: "초코",
    age: 24,
    location: "서울 강남구",
    mbti: "ISFP",
    school: "이화여자대학교",
    tags: ["드로잉", "산책", "요리", "게임"],
    bio: "혼자만의 시간을 즐기고 산책을 좋아해요. 매칭은 천천히, 대화는 길게!",
    image: "/picture2.jpg",
  },
  {
    name: "제인",
    age: 22,
    location: "인천 연수구",
    mbti: "ENFP",
    school: "연세대학교",
    tags: ["음악", "영화감상", "베이킹", "보드게임"],
    bio: "사람 만나는 걸 좋아하고 즐거운 활동을 찾는 중이에요!",
    image: "/picture3.jpg",
  },
];

export default function LikesPage() {
  const [likedProfiles, setLikedProfiles] = useState<typeof cards>([]);

  useEffect(() => {
    const stored = localStorage.getItem("likedUsers");
    if (stored) {
      const likedNames = JSON.parse(stored);
      const filtered = cards.filter((card) => likedNames.includes(card.name));
      setLikedProfiles(filtered);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <TopNav />

      <main className="flex-grow pt-24 pb-28 px-4 flex flex-col items-center">
        {likedProfiles.length === 0 ? (
          <div className="text-center mt-20">
            <Heart size={64} strokeWidth={1.5} className="text-[#D38B70] mb-6" />
            <h1 className="text-2xl font-bold text-[#D38B70] mb-2">
              좋아요를 보낸 사람이 아직 없습니다
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
