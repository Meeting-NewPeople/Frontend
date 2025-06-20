"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "../components/TopNav";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("로그인 시도:", email);
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("✅ 로그인 성공:", user);
      console.log("닉네임:", user.displayName);
  
      router.push("/");
    } catch (error: any) {
      const code = error.code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        alert("아이디와 비밀번호가 일치하지 않습니다.");
      } else {
        console.error("❌ 로그인 실패:", error.message);
        alert(`로그인 실패: ${error.message}`);
      }
    }
    
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFFDF9] px-4">
      <TopNav />
      <h1 className="text-3xl font-bold text-[#D38B70] mb-8">로그인</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-2xl w-full max-w-sm px-8 py-6 space-y-5 border border-[#F5E9DA]"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D38B70] text-sm text-black"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D38B70] text-sm text-black"
            placeholder="비밀번호"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#D38B70] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#c5775e] transition"
        >
          로그인
        </button>

        <div className="text-center text-xs text-gray-500 mt-3">
          <a href="/signup" className="hover:underline mr-3">
            회원가입
          </a>
          <a href="#" className="hover:underline">
            비밀번호 찾기
          </a>
        </div>
      </form>
    </div>
  );
}
