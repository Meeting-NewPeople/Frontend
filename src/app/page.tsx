"use client";

import { useState } from "react";
import FoodMap from "./tabs/foodmap/page";
import Mentor from "./tabs/mentor/page";
import LoveCalendar from "./tabs/lovecalendar/page";

export default function Home() {
  const [tab, setTab] = useState<"food" | "mentor" | "love">("food");

  return (
    <div>
      {/* 탭 선택 */}
      <div className="flex justify-around py-4 bg-[#FFF5EE] shadow-sm fixed w-full top-0 z-10">
        <button onClick={() => setTab("food")}>맛집 지도</button>
        <button onClick={() => setTab("mentor")}>대학 멘토</button>
        <button onClick={() => setTab("love")}>러브캘린더</button>
      </div>

      <div className="pt-16">
        {tab === "food" && <FoodMap />}
        {tab === "mentor" && <Mentor />}
        {tab === "love" && <LoveCalendar />}
      </div>
    </div>
  );
}
