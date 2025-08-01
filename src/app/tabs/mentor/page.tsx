"use client";
import BottomNav from "@/app/components/BottomNav";
import TopNav from "@/app/components/TopNav";

type Mentor = {
  name: string;
  tag: string;
  description: string;
};

const dummyMentors: Mentor[] = [
  { name: "달콤한알파카", tag: "로스쿨", description: "서울 양천구 졸업" },
  { name: "짭짤한볶음밥", tag: "행정고시", description: "연세대 졸업" },
  { name: "용감한루피트", tag: "대기업 취업", description: "서울대 졸업" },
];

export default function MentorPage() {
  return (
    <div className="px-4 pt-6 space-y-4">
        <TopNav />
      {dummyMentors.map((mentor) => (
        <div
          key={mentor.name}
          className="p-4 border rounded-xl shadow-sm bg-white space-y-1"
        >
          <div className="font-bold text-[#4B2E2E]">{mentor.name}</div>
          <div className="text-xs text-[#B36B00]">{mentor.tag}</div>
          <div className="text-sm text-gray-600">{mentor.description}</div>
        </div>
      ))}
      <BottomNav />
    </div>
  );
}
