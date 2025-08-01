"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const blacklistQuery = query(
        collection(db, "blockedEmails"),
        where("email", "==", email)
      );
      const blacklistSnap = await getDocs(blacklistQuery);
      if (!blacklistSnap.empty) {
        alert("해당 이메일은 탈퇴된 계정으로 다시 가입할 수 없습니다.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nickname });

      alert("회원가입이 완료되었습니다!");
      router.push("/tabs/lovecalendar");
    } catch (error: any) {
      alert(`회원가입 실패: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold text-[#D38B70] mb-8">회원가입</h1>

      <form
        onSubmit={handleSignUp}
        className="bg-[#1F2937] border border-gray-700 rounded-xl px-6 py-6 space-y-4 w-full max-w-sm shadow-lg"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="이메일"
          className="w-full px-4 py-2 rounded bg-[#2D3748] border border-gray-600 text-white placeholder-gray-400"
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          placeholder="이름 (닉네임)"
          className="w-full px-4 py-2 rounded bg-[#2D3748] border border-gray-600 text-white placeholder-gray-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호"
          className="w-full px-4 py-2 rounded bg-[#2D3748] border border-gray-600 text-white placeholder-gray-400"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#D38B70] py-2 rounded-lg font-semibold hover:bg-[#c5775e] transition"
        >
          {submitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
