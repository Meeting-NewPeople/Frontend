"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const uid = session?.user?.id || "sample-user-id"; // fallback for dev

  const [userData, setUserData] = useState<UserProfile>({
    image: "",
    nickname: "",
    mbti: "",
    age: "",
    location: "",
    bio: "",
    tags: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          image: data.image || "",
          nickname: data.nickname || "",
          mbti: data.mbti || "",
          age: data.age || "",
          location: data.location || "",
          bio: data.bio || "",
          tags: data.tags || [],
        });
      }
    };
    fetchData();
  }, [uid]);

  const handleSaveProfile = async () => {
    try {
      await setDoc(doc(db, "users", uid), userData);
      alert("프로필이 저장되었습니다.");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-3xl border border-[#F5E9DA] p-6 w-full max-w-sm space-y-4">
        <img
          src={userData.image || "/default-profile.png"}
          alt={userData.nickname}
          className="w-24 h-24 rounded-full object-cover mx-auto border border-gray-200"
        />
        <input
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
        />
        <input
          type="text"
          value={userData.nickname}
          onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
          className="text-lg font-semibold text-center border-b w-full"
        />
        <input
          type="text"
          placeholder="MBTI"
          value={userData.mbti}
          onChange={(e) => setUserData({ ...userData, mbti: e.target.value })}
          className="text-sm border px-2 py-1 w-full"
        />
        <input
          type="number"
          placeholder="나이"
          value={userData.age}
          onChange={(e) => setUserData({ ...userData, age: e.target.value })}
          className="text-sm border px-2 py-1 w-full"
        />
        <input
          type="text"
          placeholder="지역"
          value={userData.location}
          onChange={(e) => setUserData({ ...userData, location: e.target.value })}
          className="text-sm border px-2 py-1 w-full"
        />
        <textarea
          placeholder="한 줄 소개"
          value={userData.bio}
          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          className="w-full text-sm border p-2 rounded"
        />
        <input
          type="text"
          placeholder="#태그, #쉼표로 구분"
          value={userData.tags.join(", ")}
          onChange={(e) =>
            setUserData({
              ...userData,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
          className="text-sm border w-full px-2 py-1 rounded"
        />
        <button
          onClick={handleSaveProfile}
          className="w-full bg-[#FCD9A0] py-2 rounded text-[#4B2E2E] font-semibold"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}