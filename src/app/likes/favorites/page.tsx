// src/app/likes/favorites/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/app/firebase/firebaseConfig";
import TopNav from "@/app/components/TopNav";
import BottomNav from "@/app/components/BottomNav";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

type ProfileCard = { name: string; age: number; mbti: string; location: string; tags: string[]; image: string; };

export default function FavoritesPage() {
  const [user, loading] = useAuthState(auth);
  const [favorites, setFavorites] = useState<ProfileCard[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      if (!user) return router.push("/login");
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) return;
      const liked = userSnap.data().likedUsers || [];

      const qs = await getDocs(collection(db, "users"));
      const cards: ProfileCard[] = [];
      qs.forEach(s => {
        const d = s.data();
        if (liked.includes(d.nickname)) {
          cards.push({
            name: d.nickname,
            age: d.age,
            mbti: d.mbti,
            location: d.location,
            tags: d.tags || [],
            image: d.image || "/default-profile.png",
          });
        }
      });
      setFavorites(cards);
    };
    fetch();
  }, [user, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col">
      <TopNav />
      <main className="pt-[72px] px-4 pb-28 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6">💛 내가 좋아요한 프로필</h2>
        {favorites.length === 0 ? (
          <div className="text-center mt-20">
            <Heart size={64} className="text-[#D38B70]" />
            <p className="mt-4 text-gray-400">좋아요한 프로필이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {favorites.map((c) => (
              <div key={c.name} className="bg-[#1F2937] rounded-xl p-4">
                <img src={c.image} alt={c.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                <p className="font-semibold">{c.name}, {c.age}</p>
                <p className="text-gray-400 text-xs">{c.mbti}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
