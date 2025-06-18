"use client";

import "./TopNav.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import {usePathname, useRouter} from "next/navigation";

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      const pathname = window.location.pathname; // ✅ 현재 경로 확인
      if (pathname === "/profile/edit") return;  // ✅ 등록 페이지면 무시
  
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        router.push("/profile/require");
      }
    };
  
    checkProfile();
  }, []);

  // 알림 더미 데이터
  const likedUsers = ["다정한쥐", "호기심많은토끼"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      // ✅ 로그인 후 프로필 등록 여부 확인
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          router.push("/profile/require"); // 프로필 등록 안내 페이지로 이동
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("로그아웃하시겠습니까?");
    if (!confirmLogout) return;

    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="topnav">
      <Link href="/">
        <h1 className="logo">Quokka</h1>
      </Link>

      <div className="nav-actions">
        {user && (
          <div className="notification-wrapper">
            <button
              className="alert-btn"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              🔔 알림
            </button>
            {showNotifications && (
              <div className="notification-box">
                {likedUsers.length > 0 ? (
                  likedUsers.map((name, index) => (
                    <div key={index} className="notification-item">
                      ❤️ {name} 님이 당신을 좋아합니다
                    </div>
                  ))
                ) : (
                  <div className="notification-empty">
                    좋아요를 보낸 사람이 아직 없습니다
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!isLoading && (
          user ? (
            <button onClick={handleLogout} className="auth-btn">
              로그아웃
            </button>
          ) : (
            <button onClick={() => router.push("/login")} className="auth-btn">
              로그인
            </button>
          )
        )}
      </div>
    </header>
  );
}
