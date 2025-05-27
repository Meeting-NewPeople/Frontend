"use client";

import "./TopNav.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();

  // 가짜 좋아요 보낸 사람들 (예시)
  const likedUsers = ["다정한쥐", "호기심많은토끼"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
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
                  <div className="notification-empty">좋아요를 보낸 사람이 아직 없습니다</div>
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
