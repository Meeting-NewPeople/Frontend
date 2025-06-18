"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

interface UserProfile {
  image: string;
  nickname: string;
  mbti: string;
  age: string;
  location: string;
  bio: string;
  tags: string[];
}

export default function EditProfilePage() {
  const [userData, setUserData] = useState<UserProfile>({
    image: "",
    nickname: "",
    mbti: "",
    age: "",
    location: "",
    bio: "",
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user: User | null = auth.currentUser;

      if (!user) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserProfile);
        } else {
          alert("사용자 정보를 불러오지 못했습니다.");
        }
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
        alert("오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), userData);
      alert("프로필이 저장되었습니다.");
      router.push("/profile");
    } catch (err) {
      alert("저장에 실패했습니다.");
      console.error(err);
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFFDF9] px-4">
      <div className="bg-white shadow-lg rounded-3xl border border-[#F5E9DA] p-6 w-full max-w-sm space-y-4">
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="profileImage"
            className="cursor-pointer px-4 py-2 text-xs bg-[#FFEEDB] text-[#B36B00] rounded-full hover:bg-[#ffdeb8] transition"
          >
            📷 프로필 이미지 변경
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setUserData({ ...userData, image: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
            style = {{display:"none"}}
          />

          <img
            src={userData.image || "/default-profile.png"}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

        <input
          type="text"
          value={userData.nickname}
          onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
          className="text-lg font-semibold text-[#4B2E2E] text-center w-full border-b focus:outline-none"
        />
        <input
          type="text"
          placeholder="MBTI"
          value={userData.mbti}
          onChange={(e) => setUserData({ ...userData, mbti: e.target.value })}
          className="text-sm text-center w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="나이"
          value={userData.age}
          onChange={(e) => setUserData({ ...userData, age: e.target.value })}
          className="text-sm text-center w-full border px-2 py-1 rounded text-black"
        />
        <input
          type="text"
          placeholder="지역"
          value={userData.location}
          onChange={(e) => setUserData({ ...userData, location: e.target.value })}
          className="text-sm text-center w-full border px-2 py-1 rounded text-black"
        />
        <textarea
          placeholder="한 줄 소개"
          value={userData.bio}
          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          className="text-sm text-center w-full border p-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="#태그, 쉼표로 구분"
          value={userData.tags.join(", ")}
          onChange={(e) =>
            setUserData({
              ...userData,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
          className="text-xs text-center w-full border px-2 py-1 rounded text-black"
        />
        <button
          onClick={handleSave}
          className="w-full bg-[#D38B70] text-white py-2 rounded-lg text-sm text-center font-semibold hover:bg-[#c5775e] transition"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}