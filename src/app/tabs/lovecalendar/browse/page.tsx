"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import TopNav from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";

// 🔸 타입 정의
type FirestoreUser = {
  id: string;
  nickname?: string;
  mbti?: string;
  age?: number;
  location?: string;
  bio?: string;
  school?: string;
  tags?: string[];
  image?: string;
  likedUsers?: string[];
};

type CardData = {
  name: string;
  age: number;
  location: string;
  mbti: string;
  school: string;
  tags: string[];
  bio: string;
  image: string;
  nickname: string;
  id: string;
};

export default function BrowsePage() {
  const [user] = useAuthState(auth);
  const [cards, setCards] = useState<CardData[]>([]);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [currentNickname, setCurrentNickname] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!user) return router.push("/login");

    const fetchUser = async () => {
      const snap = await getDocs(collection(db, "users"));
      const firestoreUsers: FirestoreUser[] = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as FirestoreUser[];

      const my = firestoreUsers.find((u) => u.id === user.uid);
      setLikedUsers(my?.likedUsers || []);
      setCurrentNickname(my?.nickname || "");

      const filteredUsers = firestoreUsers.filter(
        (u) => u.id !== user.uid && !!u.nickname
      );

      const cardDataList: CardData[] = filteredUsers.map((user) => ({
        name: user.nickname || "익명",
        age: user.age || 0,
        location: user.location || "지역 없음",
        mbti: user.mbti || "MBTI 없음",
        school: user.school || "",
        tags: user.tags || [],
        bio: user.bio || "",
        image: user.image || "/default-profile.png",
        nickname: user.nickname || "",
        id: user.id,
      }));

      setCards(cardDataList);
    };

    fetchUser();
  }, [user, router]);

  const toggleLike = async (nickname: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const isLiked = likedUsers.includes(nickname);

    if (!isLiked) {
      await updateDoc(docRef, { likedUsers: arrayUnion(nickname) });
    } else {
      await updateDoc(docRef, { likedUsers: arrayRemove(nickname) });
    }

    setLikedUsers((prev) =>
      isLiked ? prev.filter((n) => n !== nickname) : [...prev, nickname]
    );
  };

  return (
    <div className="bg-[#111827] text-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow pt-[72px] pb-28 px-4">
        <h2 className="text-xl font-bold text-center mb-6">만날 수 있는 사람들</h2>
        <button
        onClick={() => router.push("/likes/favorites")}
        className="w-full bg-[#B36B00] py-3 rounded-xl text-white font-semibold hover:bg-[#a35f00] transition"
      >
        내가 좋아요 누른 프로필 보기
      </button>
        <div className="text-center mb-6">
          
            <span className="text-m text-white">
              (서로 좋아요하면 채팅이 열려요!)
            </span>
          
        </div>
        {cards.map((card) => (
          <div key={card.id} className="bg-[#1F2937] rounded-xl shadow-md mb-5 p-4">
            <div className="flex items-center mb-3">
              <img
                src={card.image || "/default-profile.png"}
                alt=""
                className="w-16 h-16 rounded-full mr-3"
              />
              <div>
                <div className="text-lg font-semibold">
                  {card.name}, {card.age}
                </div>
                <div className="text-sm text-gray-400">
                  {card.location} · {card.mbti}
                </div>
              </div>
              <button
                className="ml-auto text-2xl"
                onClick={() => toggleLike(card.nickname)}
              >
                {likedUsers.includes(card.nickname) ? "❤️" : "🤍"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#374151] text-gray-300 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-300">{card.bio}</p>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
