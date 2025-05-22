// components/CardSlider.tsx
"use client";

import { useState } from "react";

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

export default function CardSlider() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
  };

  const card = cards[index];

  return (
    <div className="relative max-w-xs mx-auto mt-10">
      <div className="bg-[#FFF9F2] rounded-3xl shadow-md overflow-hidden border border-[#F5E9DA]">
        <img src={card.image} alt="profile" className="w-full h-56 object-cover" />
        <div className="p-5 space-y-3">
          <div className="text-lg font-semibold text-[#4B2E2E]">
            {card.name}, {card.age}
          </div>
          <div className="text-sm text-[#8A6E5A]">{card.location} · {card.mbti}</div>
          <div className="text-sm text-[#8A6E5A]">{card.school}</div>

          <div className="flex flex-wrap gap-2 pt-3">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#FFEEDB] text-[#B36B00] text-xs px-3 py-1 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-[#5E4A3B] leading-relaxed pt-2">
            {card.bio}
          </p>
        </div>
      </div>

      {/* 화살표 */}
      <button
        onClick={prev}
        className="absolute left-[-2.5rem] top-1/2 transform -translate-y-1/2 text-2xl text-[#B36B00] font-bold"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute right-[-2.5rem] top-1/2 transform -translate-y-1/2 text-2xl text-[#B36B00] font-bold"
      >
        ▶
      </button>
    </div>
  );
}
