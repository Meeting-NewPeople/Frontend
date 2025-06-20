"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { query, where, getDocs, collection } from "firebase/firestore";

type UserProfile = {
  nickname: string;
  email: string;
  mbti: string;
  age: number;
  location: string;
  bio: string;
  tags: string[];
  image: string;
  createdAt: Date;
};

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [mbti, setMbti] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  


  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // 🔒 블랙리스트 체크
      const blacklistQuery = query(collection(db, "blockedEmails"), where("email", "==", email));
      const blacklistSnap = await getDocs(blacklistQuery);
      if (!blacklistSnap.empty) {
        alert("해당 이메일은 탈퇴된 계정으로 다시 가입할 수 없습니다.");
        return;
      }
  
      // ✅ 회원 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, { displayName: nickname });
  
      const profile: UserProfile = {
        nickname,
        email,
        mbti,
        age: Number(age),
        location,
        bio,
        tags: tags.split(",").map((t) => t.trim()),
        image,
        createdAt: new Date(),
      };
  
      await setDoc(doc(db, "users", user.uid), profile);
  
      setUserData(profile);
      setShowCongrats(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert("회원가입 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  };
  

  if (showCongrats && userData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFFDF9] px-4 text-center">
        <h1 className="text-2xl font-bold text-[#D38B70] mb-6">
          {userData.nickname}님, 새로운 프로필 생성을 축하드려요!!! 🎉
        </h1>

        <div className="bg-white shadow-lg rounded-3xl border border-[#F5E9DA] p-6 w-full max-w-sm mb-8 space-y-4">
          <img
            src={userData.image || "/default-profile.png"}
            alt={userData.nickname}
            className="w-24 h-24 rounded-full object-cover mx-auto border border-gray-200"
          />
          <div className="text-lg font-semibold text-[#4B2E2E]">{userData.nickname}</div>
          <div className="text-sm text-[#8A6E5A]">
            {userData.mbti} / {userData.age}세 / {userData.location}
          </div>
          <p className="text-sm text-[#5E4A3B]">{userData.bio}</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {userData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#FFEEDB] text-[#B36B00] text-xs px-3 py-1 rounded-full shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="bg-[#D38B70] text-white px-6 py-2 rounded-xl hover:bg-[#c5775e] transition"
        >
          더 많은 친구들 만나러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFFDF9] px-4">
      <h1 className="text-3xl font-bold text-[#D38B70] mb-8">회원가입</h1>

      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-md rounded-2xl w-full max-w-sm px-8 py-6 space-y-4 border border-[#F5E9DA]"
      >
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="이메일"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="닉네임"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="비밀번호"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="text" value={mbti} onChange={(e) => setMbti(e.target.value)} placeholder="MBTI"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="나이"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="지역"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="한 줄 소개"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="관심 태그 (예: 캠핑, 산책)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />
        
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="프로필 이미지 URL"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D38B70] focus:border-[#D38B70] text-sm placeholder-gray-400 bg-white text-black" />


        <button type="submit" className="w-full bg-[#D38B70] text-white py-2 rounded-lg hover:bg-[#c5775e] transition">
          회원가입
        </button>
      </form>
    </div>
  );
}
