"use client";

import "./TopNav.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";

interface Notification {
  from: string;
  type: "like" | "withdrawal";
  timestamp?: Timestamp;
  status?: "pending" | "accepted" | "rejected";
}

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!confirm("로그아웃하시겠습니까?")) return;
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  const updateNotification = async (idx: number, status: "accepted" | "rejected") => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    let updated = [...notifications];
    if (status === "rejected") {
      updated.splice(idx, 1);
    } else {
      const notif = notifications[idx];
      updated[idx] = { ...notif, status };
    }

    await updateDoc(userRef, { notifications: updated });
    setNotifications(updated);

    if (status === "accepted") {
      alert(`${notifications[idx].from} 님과 매칭되었습니다! 🎉`);
    } else {
      alert(`${notifications[idx].from} 님의 요청을 거절했습니다.`);
    }
  };

  return (
    <header className="topnav">
      <div className="left-section">
        <Link href="/" className="logo">🎓 나의 대학 라이프</Link>
      </div>
      <div className="nav-actions">
        {user && (
          <div className="notification-wrapper">
            <button className="alert-btn" onClick={() => setShowNotifications(prev => !prev)}>
              🔔 알림
            </button>
            {showNotifications && (
              <div className="notification-box">
                {notifications.length > 0 ? notifications.map((n, i) => (
                  <div key={i} className="notification-item">
                    {n.type === "like" && (!n.status || n.status === "pending") && (
                      <>
                        <p>
                          <strong>{n.from}</strong> 님이 회원님의 프로필에 좋아요를 눌렀습니다.<br />
                          수락하시겠습니까?
                        </p>
                        <div className="btn-group">
                          <button onClick={() => updateNotification(i, "accepted")} className="btn-accept">수락</button>
                          <button onClick={() => updateNotification(i, "rejected")} className="btn-reject">거절</button>
                        </div>
                      </>
                    )}
                    {n.type === "like" && n.status === "accepted" && (
                      <p>💌 <strong>{n.from}</strong> 님과 매칭되었습니다.</p>
                    )}
                    {n.type === "like" && n.status === "rejected" && (
                      <p>❌ <strong>{n.from}</strong> 님의 요청을 거절하셨습니다.</p>
                    )}
                    {n.type === "withdrawal" && (
                      <p>⚠️ <strong>{n.from}</strong> 님이 탈퇴하였습니다.</p>
                    )}
                  </div>
                )) : <div className="notification-empty">알림이 없습니다</div>}
              </div>
            )}
          </div>
        )}
        {!isLoading && (
          user
            ? <button onClick={handleLogout} className="auth-btn">로그아웃</button>
            : <button onClick={() => router.push("/login")} className="auth-btn">로그인</button>
        )}
      </div>
    </header>
  );
}
