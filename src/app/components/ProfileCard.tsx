// components/ProfileCard.tsx
export default function ProfileCard() {
    return (
      <div className="bg-[#FFF9F2] rounded-3xl shadow-md max-w-xs mx-auto mt-10 overflow-hidden border border-[#F5E9DA]">
        <img
          src="/picture1.jpg"
          alt="profile"
          className="w-full h-56 object-cover"
        />
        <div className="p-5 space-y-3">
          <div className="text-lg font-semibold text-[#4B2E2E]">나무잎, 23</div>
          <div className="text-sm text-[#8A6E5A]">서울 은평구 · ENTJ</div>
          <div className="text-sm text-[#8A6E5A]">성균관대학교</div>
  
          <div className="flex flex-wrap gap-2 pt-3">
            {['학업', '등산', '헬스', '요리하기'].map((tag) => (
              <span
                key={tag}
                className="bg-[#FFEEDB] text-[#B36B00] text-xs px-3 py-1 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
  
          <p className="text-sm text-[#5E4A3B] leading-relaxed pt-2">
            아기자기한 카페를 좋아하고, 맛집 가는 거 좋아하고, 운동도 좋아해요.
            03년생입니다! 매칭 요청해주시고, 오픈채팅 쿼카 나무잎으로 와주세요.
          </p>
        </div>
      </div>
    );
  }
  