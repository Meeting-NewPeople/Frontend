"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import TopNav from "../../components/TopNav";
import BottomNav from "../../components/BottomNav";
import { db, auth } from "../../firebase/firebaseConfig";

// 🔸 Chat 메시지 타입 명시
type ChatMessage = {
  from: string;
  text: string;
  timestamp: Timestamp;
};

export default function ChatDetailPage() {
  const { nickname: encodedNickname } = useParams();
  const theirNickname = decodeURIComponent(
    typeof encodedNickname === "string" ? encodedNickname : encodedNickname?.[0] ?? ""
  );

  const [user] = useAuthState(auth);
  const [myNickname, setMyNickname] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const roomId = [myNickname, theirNickname].sort().join("_");

  // 🔸 내 닉네임 가져오기
  useEffect(() => {
    if (!user) return;
    const fetchNickname = async () => {
      const userDocs = await getDocs(collection(db, "users"));
      userDocs.forEach((doc) => {
        if (doc.id === user.uid) {
          setMyNickname(doc.data().nickname);
        }
      });
    };
    fetchNickname();
  }, [user]);

  // 🔸 실시간 메시지 수신
  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "chatRooms", roomId, "messages"),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data() as ChatMessage);
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  // 🔸 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || !myNickname || !theirNickname) return;

    await addDoc(collection(db, "chatRooms", roomId, "messages"), {
      from: myNickname,
      text: input,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <TopNav />

      <main className="flex flex-col flex-grow px-4 pt-20 pb-28">
        <h2 className="text-center text-[#B36B00] font-bold mb-4">
          {theirNickname}님과의 채팅
        </h2>

        <div className="flex flex-col space-y-2 mb-4 overflow-y-auto flex-grow">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                msg.from === myNickname
                  ? "self-end bg-[#FFD8B5]"
                  : "self-start bg-white border"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-grow border rounded-full px-4 py-2 text-sm"
          />
          <button
            onClick={sendMessage}
            className="bg-[#D38B70] text-white px-4 py-2 rounded-full text-sm"
          >
            전송
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
