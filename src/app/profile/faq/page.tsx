"use client";

import { useState } from "react";
import TopNav from "../../components/TopNav";
import BottomNav from "../../components/BottomNav";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "매칭은 어떻게 이루어지나요?",
    answer: "서로 좋아요를 누른 경우 자동으로 매칭됩니다. 매칭된 후 채팅이 가능해요.",
  },
  {
    question: "프로필은 어떻게 수정하나요?",
    answer: "프로필 페이지에서 '✏️ 프로필 수정' 버튼을 눌러 수정할 수 있습니다.",
  },
  {
    question: "회원 탈퇴는 어떻게 하나요?",
    answer: "설정 페이지에서 탈퇴 관련 메뉴를 통해 진행할 수 있습니다.",
  },
  {
    question: "좋아요는 몇 명까지 할 수 있나요?",
    answer: "좋아요 횟수에는 제한이 없습니다. 마음에 드는 사람에게 자유롭게 눌러보세요!",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-[#FFFDF9] pt-24 pb-28 px-6">
        <h1 className="text-2xl font-bold text-[#B36B00] mb-6">자주 묻는 질문</h1>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#F1E8DC] rounded-xl shadow-sm p-4"
            >
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-sm font-semibold text-[#4B2E2E]">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <ChevronUp size={18} className="text-[#B36B00]" />
                ) : (
                  <ChevronDown size={18} className="text-[#B36B00]" />
                )}
              </button>
              {openIndex === idx && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
