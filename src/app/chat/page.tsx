"use client";
import BottomNav from "@/app/components/BottomNav";
import TopNav from "@/app/components/TopNav";
import { useRouter } from "next/navigation";

type Mentor = {
  name: string;
  nickname: string; // 🔸 채팅 이동용
  major: string;
  tag: string[];
  description: string;
};

const dummyMentors: Mentor[] = [
  {
    name: "김서강",
    nickname: "lawalpaca",
    major: "서강대 법학과",
    tag: ["로스쿨", "면접 꿀팁", "학점 관리"],
    description: "현직 변호사, 진로 상담 가능",
  },
  {
    name: "김성균",
    nickname: "govrice",
    major: "성균관대 행정학과",
    tag: ["행정고시", "PSAT 전략", "스터디 코칭"],
    description: "고시생 멘토 경험 다수",
  },
  {
    name: "김서울",
    nickname: "samlupt",
    major: "서울대 전기공학부",
    tag: ["삼성전자", "인턴 경험", "자소서 첨삭"],
    description: "대기업 취업 방향 제시",
  },
];

export default function MentorPage() {
  const router = useRouter();

  return (
    <div className="bg-[#111827] min-h-screen text-white pt-[72px] px-4 pb-20">
      <TopNav />
      <h1 className="text-xl font-bold text-center mb-6">🎓 선배 & 멘토 찾기</h1>

      {dummyMentors.map((mentor) => (
        <div
          key={mentor.nickname}
          className="bg-[#1F2937] p-5 rounded-xl shadow-md space-y-3 mb-5 border border-[#2d3748]"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold text-[#FBBF24]">{mentor.name}</div>
              <div className="text-sm text-gray-300">{mentor.major}</div>
            </div>
            <button
              onClick={() => router.push(`/chat/${mentor.nickname}`)}
              className="bg-[#B36B00] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#a35f00]"
            >
              멘토님께 연락하기
            </button>
          </div>
          <div className="text-sm text-gray-200">{mentor.description}</div>
          <div className="flex flex-wrap gap-2">
            {mentor.tag.map((t) => (
              <span
                key={t}
                className="text-xs bg-[#374151] text-white px-2 py-1 rounded-full"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      ))}

      <BottomNav />
    </div>
  );
}
