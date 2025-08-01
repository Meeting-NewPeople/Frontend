// app/page.tsx
"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col justify-center items-center px-4">
      {/* 로고 */}
      <div className="text-2xl font-bold absolute top-6 left-6">나의 대학 라이프</div>

      {/* 중앙 설명 */}
      <div className="text-center max-w-xl mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">대학 생활, 더 즐겁게! 더 알차게!</h1>
        <p className="text-[#CCCCCC] text-sm sm:text-base">
          지역 기반으로 맛집부터 멘토, 미팅까지<br />
          당신의 생활을 풍요롭게 해주는 3가지 기능
        </p>
      </div>

      {/* 기능 카드 3개 */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        <FeatureCard
          title="맛집 탐방"
          description="서울 각 구별 인기 맛집 지도 보기"
          href="/seoul-map"
          emoji="🍜"
          color="bg-[#EA580C]"
        />
        <FeatureCard
          title="멘토/선배 찾기"
          description="우리 동네 선배, 취업 멘토 찾아보기"
          href="/mentor"
          emoji="🎓"
          color="bg-[#7C3AED]"
        />
        <FeatureCard
          title="미팅/소개팅"
          description="동네 기반 미팅/소개팅 연결 서비스"
          href="/match"
          emoji="💖"
          color="bg-[#DB2777]"
        />
      </div>

      {/* 하단 설명 */}
      <p className="text-sm text-gray-400 mt-12 text-center">
        지역 라이프는 동네 생활을 돕는 3가지 주요 기능을 제공합니다.
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  emoji,
  color,
}: {
  title: string;
  description: string;
  href: string;
  emoji: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg p-6 text-white ${color} hover:opacity-90 transition shadow-lg text-center`}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm">{description}</p>
    </Link>
  );
}
