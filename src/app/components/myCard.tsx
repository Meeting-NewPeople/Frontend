"use client";

import React from "react";

interface CardProps {
  nickname: string;
  mbti: string;
  age: number;
  location: string;
  bio: string;
  tags: string[];
  image?: string;
}

export default function Card({
  nickname,
  mbti,
  age,
  location,
  bio,
  tags,
  image,
}: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-[#F5E9DA] p-4 space-y-3">
      <div className="flex items-center space-x-4">
        <img
          src={image || "/default-profile.png"} // 기본 이미지 경로 지정 가능
          alt="profile"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-lg font-bold text-[#D38B70]">{nickname}</h2>
          <p className="text-sm text-gray-600">{mbti} / {age}세 / {location}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700">{bio}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-[#F5E9DA] text-[#8A6E5A] text-xs px-3 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
