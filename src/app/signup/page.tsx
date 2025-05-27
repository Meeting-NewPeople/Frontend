"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Firebase에 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // displayName 업데이트 (닉네임 저장)
      await updateProfile(userCredential.user, {
        displayName: nickname,
      });

      alert(`${nickname}님, 회원가입이 완료되었습니다!`);
      router.push("/login");
    } catch (error: any) {
      alert(`회원가입 실패: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFFDF9] px-4">
      <h1 className="text-3xl font-bold text-[#D38B70] mb-8">회원가입</h1>

      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-md rounded-2xl w-full max-w-sm px-8 py-6 space-y-5 border border-[#F5E9DA]"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D38B70] text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D38B70] text-sm"
            placeholder="예: 나무잎"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D38B70] text-sm"
            placeholder="비밀번호"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#D38B70] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#c5775e] transition"
        >
          회원가입
        </button>

        <div className="text-center text-xs text-gray-500 mt-3">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-[#D38B70] hover:underline">
            로그인
          </a>
        </div>
      </form>
    </div>
  );
}
