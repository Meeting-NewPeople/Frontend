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

  useEffect(() => {
    if (!userUid) return;

    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const loadedCards: CardData[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        // ✅ 자기 자신의 카드 제외
        if (docSnap.id !== userUid && data.nickname && data.age) {
          loadedCards.push({
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

      setCards(loadedCards);
    };

    fetchCards();
  }, [userUid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        setCurrentUserNickname(user.displayName ?? "익명");

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLikedCards(data.likedUsers || []);
        } else {
          await setDoc(docRef, { likedUsers: [] });
          setLikedCards([]);
        }
      } else {
        setUserUid(null);
        const stored = localStorage.getItem("likedUsers");
        setLikedCards(stored ? JSON.parse(stored) : []);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleLike = async () => {
    const card = cards[index];
    const name = card.name;
    const isLiked = likedCards.includes(name);

    if (!userUid) {
      alert("로그인이 필요해요!");
      return;
    }

    if (!isLiked) {
      const targetQuery = query(collection(db, "users"), where("nickname", "==", name));
      const targetSnap = await getDocs(targetQuery);

      if (!targetSnap.empty) {
        const targetDocRef = targetSnap.docs[0].ref;
        await updateDoc(targetDocRef, {
          notifications: arrayUnion({
            from: currentUserNickname,
            type: "like",
            timestamp: new Date(),
          }),
        });
      }
    }

    const docRef = doc(db, "users", userUid);
    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { likedUsers: [] });
      }

      if (isLiked) {
        await updateDoc(docRef, { likedUsers: arrayRemove(name) });
        setLikedCards((prev) => prev.filter((n) => n !== name));
      } else {
        await updateDoc(docRef, { likedUsers: arrayUnion(name) });
        setLikedCards((prev) => [...prev, name]);
      }
    } catch (err) {
      console.error("Firestore 저장 오류:", err);
    }
  };

  const prev = () => setIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  const next = () => setIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));

  if (cards.length === 0) {
    return <div className="text-center mt-10 text-[#B36B00]">불러올 카드가 없습니다 😢</div>;
  }

  const card = cards[index];
  const isLiked = likedCards.includes(card.name);

  return (
    <div className="relative max-w-xs mx-auto mt-10">
      <div className="bg-[#FFF9F2] rounded-3xl shadow-md overflow-hidden border border-[#F5E9DA]">
        <img src={card.image} alt="profile" className="w-full h-56 object-cover" />
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-[#4B2E2E]">
              {card.name}, {card.age}
            </div>
            <button
              onClick={toggleLike}
              className="text-2xl mt-1 transition hover:scale-110"
              aria-label="좋아요"
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
          </div>
          <div className="text-sm text-[#8A6E5A]">{card.location} · {card.mbti}</div>
          <div className="text-sm text-[#8A6E5A]">{card.school}</div>
          <div className="flex flex-wrap gap-2 pt-3">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#FFEEDB] text-[#B36B00] text-xs px-3 py-1 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-[#5E4A3B] leading-relaxed pt-2">{card.bio}</p>
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
  );
}
