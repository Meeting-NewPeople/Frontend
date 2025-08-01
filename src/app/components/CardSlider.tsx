"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { useRouter } from "next/navigation";

type CardData = {
  name: string;
  age: number;
  location: string;
  mbti: string;
  school: string;
  tags: string[];
  bio: string;
  image: string;
};

export default function CardSlider() {
  const [index, setIndex] = useState(0);
  const [likedCards, setLikedCards] = useState<string[]>([]);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>("");
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // ✅ 로그인 감지 및 likedUsers 불러오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthChecked(true);
      if (user) {
        setUserUid(user.uid);
        setCurrentUserNickname(user.displayName ?? "익명");

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setLikedCards(snap.data().likedUsers || []);
        } else {
          await setDoc(ref, { likedUsers: [] });
        }
      } else {
        setUserUid(null);
        const stored = localStorage.getItem("likedUsers");
        setLikedCards(stored ? JSON.parse(stored) : []);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ 카드 불러오기 (본인/탈퇴 유저 제외)
  useEffect(() => {
    if (!userUid) return;

    const fetchCards = async () => {
      const qs = await getDocs(collection(db, "users"));
      const loaded: CardData[] = [];

      qs.forEach((snap) => {
        const data = snap.data();
        if (
          snap.id !== userUid &&
          !data.deleted &&
          data.nickname &&
          data.age
        ) {
          loaded.push({
            name: data.nickname,
            age: data.age,
            location: data.location,
            mbti: data.mbti,
            school: data.school ?? "",
            tags: data.tags ?? [],
            bio: data.bio ?? "",
            image: data.image?.trim() || "/default-profile.png",
          });
        }
      });

      setCards(loaded);
    };

    fetchCards();
  }, [userUid]);

  // ✅ 좋아요 토글
  const toggleLike = async () => {
    if (!userUid) {
      alert("로그인이 필요해요!");
      return;
    }
    const card = cards[index];
    const name = card.name;
    const isLiked = likedCards.includes(name);
    const docRef = doc(db, "users", userUid);

    if (!isLiked) {
      const q = query(collection(db, "users"), where("nickname", "==", name));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const targetRef = snap.docs[0].ref;
        await updateDoc(targetRef, {
          notifications: arrayUnion({
            from: currentUserNickname,
            type: "like",
            timestamp: new Date(),
            status: "pending",
          }),
        });
      }
    }

    await updateDoc(docRef, {
      likedUsers: isLiked
        ? arrayRemove(name)
        : arrayUnion(name),
    });
    setLikedCards(prev =>
      isLiked ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const prev = () => setIndex(i => (i === 0 ? cards.length - 1 : i - 1));
  const next = () => setIndex(i => (i === cards.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF9]">
      <TopNav />

      <main className="flex-grow pt-24 pb-28 px-4 flex flex-col items-center">
        {/* ✅ 로그인한 사용자만 제목 표시 */}
        {userUid && authChecked && (
          <h2 className="text-lg font-bold text-center text-[#B36B00] mb-4">
            Meeting New Friends
          </h2>
        )}

        {/* ❌ 로그인 안 된 경우 안내 */}
        {!userUid && authChecked && (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-6xl mb-2 animate-bounce">🔐</div>
            <p className="text-[#B36B00] text-2xl font-bold mb-2">
              로그인이 필요해요
            </p>
            <p className="text-[#8A6E5A] text-base leading-relaxed mb-4 text-center">
              프로필 카드를 확인하려면<br />
              먼저 로그인해주세요
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-[#D38B70] text-white px-6 py-2 rounded-xl hover:bg-[#b7745a] transition"
            >
              로그인하러 가기
            </button>
          </div>
        )}

        {/* 📭 카드 없음 */}
        {userUid && cards.length === 0 && (
          <div className="text-center mt-10 text-[#B36B00]">
            불러올 카드가 없습니다 😢
          </div>
        )}

        {/* ✅ 카드 슬라이더 */}
        {userUid && cards.length > 0 && (
          <div className="relative max-w-xs mx-auto mt-10">
            <div className="bg-[#FFF9F2] rounded-3xl shadow-md overflow-hidden border border-[#F5E9DA]">
              <img
                src={cards[index].image}
                alt="profile"
                className="w-full h-56 object-cover"
              />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-[#4B2E2E]">
                    {cards[index].name}, {cards[index].age}
                  </div>
                  <button
                    onClick={toggleLike}
                    className="text-2xl mt-1 transition hover:scale-110"
                    aria-label="좋아요"
                  >
                    {likedCards.includes(cards[index].name)
                      ? "❤️"
                      : "🤍"}
                  </button>
                </div>
                <div className="text-sm text-[#8A6E5A]">
                  {cards[index].location} · {cards[index].mbti}
                </div>
                <div className="text-sm text-[#8A6E5A]">
                  {cards[index].school}
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                  {cards[index].tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-[#FFEEDB] text-[#B36B00] text-xs px-3 py-1 rounded-full shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#5E4A3B] leading-relaxed pt-2">
                  {cards[index].bio}
                </p>
              </div>
            </div>

            <button
              onClick={prev}
              className="absolute left-[-2.5rem] top-1/2 transform -translate-y-1/2 text-2xl text-[#B36B00] font-bold"
            >
              ◀
            </button>
            <button
              onClick={next}
              className="absolute right-[-2.5rem] top-1/2 transform -translate-y-1/2 text-2xl text-[#B36B00] font-bold"
            >
              ▶
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
