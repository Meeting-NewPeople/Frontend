"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import TopNav from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";

type UserProfile = {
    nickname: string;
    mbti: string;
    age: number;
    location: string;
    bio: string;
    tags: string[];
    image: string;
    createdAt: Date;
  };

export default function ProfileRegisterPage() {
    const [user, loading] = useAuthState(auth);
    const [form, setForm] = useState({
        nickname: "",
        mbti: "",
        age: "",
        location: "",
        bio: "",
        tags: "",
        image: "",
      });
      
    const [submitting, setSubmitting] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [userData, setUserData] = useState<UserProfile | null>(null); // 🔸 이 줄 추가
    
    const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const docRef = doc(db, "users", user.uid);
    const exist = await getDoc(docRef);
    if (exist.exists()) {
      alert("이미 프로필이 존재합니다.");
      router.push("/tabs/lovecalendar");
      return;
    }

    await setDoc(docRef, {
      nickname: form.nickname,
      mbti: form.mbti,
      age: Number(form.age),
      location: form.location,
      bio: form.bio,
      tags: form.tags.split(",").map((t) => t.trim()),
      image: form.image || "/default-profile.png",
      createdAt: new Date(),
    });

    alert("프로필이 등록되었습니다!");
    router.push("/tabs/lovecalendar");
  };

  if (loading || !user) return null;
   // ✅ 축하 메시지 화면
   if (showCongrats && userData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#111827] text-white px-4 text-center">
        <TopNav />
        <h1 className="text-2xl font-bold text-[#FBBF77] mb-6">
          {userData.nickname}님, 🎉 프로필 등록이 완료되었습니다!
        </h1>

        <div className="bg-[#1F2937] shadow-lg rounded-3xl border border-[#2E3A4A] p-6 w-full max-w-sm mb-8 space-y-4">
          <img
            src={userData.image}
            alt={userData.nickname}
            className="w-24 h-24 rounded-full object-cover mx-auto border border-gray-500"
          />
          <div className="text-lg font-semibold">{userData.nickname}</div>
          <div className="text-sm text-gray-400">
            {userData.mbti} · {userData.age}세 · {userData.location}
          </div>
          <p className="text-sm text-gray-300">{userData.bio}</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {userData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#374151] text-white text-xs px-3 py-1 rounded-full shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/tabs/lovecalendar/browse")}
          className="bg-[#D38B70] text-white px-6 py-2 rounded-xl hover:bg-[#c5775e] transition"
        >
          다른 사람 프로필 구경하기
        </button>

        <button
          onClick={() => router.push("/tabs/lovecalendar/edit")}
          className="mt-4 bg-[#374151] text-white px-6 py-2 rounded-xl hover:bg-[#4b5563] transition"
        >
          내 프로필 수정하기
        </button>

        <BottomNav />
      </div>
    );
  }


  const fields = [
    { name: "nickname", label: "닉네임" },
    { name: "mbti", label: "MBTI" },
    { name: "age", label: "나이" },
    { name: "location", label: "지역 (예: 서울시 은평구)" },
    { name: "bio", label: "소개" },
    { name: "tags", label: "관심 태그 (예: 캠핑, 산책)" },
    { name: "image", label: "이미지 URL" },
  ] as const;

  return (
    <div className="bg-[#111827] min-h-screen text-white pt-[72px] px-4 pb-20">
      <TopNav />
      <h1 className="text-xl font-bold text-center mb-6">프로필 등록하기</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {fields.map(({ name, label }) => (
  <div key={name}>
    <label className="block text-gray-300 mb-1">{label}</label>
    {name === "bio" ? (
      <textarea
        name={name}
        value={form[name]}
        onChange={handleChange}
        required
        className="w-full p-2 rounded bg-[#1F2937]"
      />
    ) : (
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        required
        className="w-full p-2 rounded bg-[#1F2937]"
      />
    )}
  </div>
))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#B36B00] py-3 rounded-xl font-semibold hover:bg-[#a35f00] transition"
        >
          {submitting ? "등록 중..." : "프로필 등록"}
        </button>
      </form>
      <BottomNav />
    </div>
  );
}
