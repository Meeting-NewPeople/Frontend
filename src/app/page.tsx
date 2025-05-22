// app/page.tsx
import ProfileCard from "./components/ProfileCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] py-10">
      <h1 className="text-3xl text-[#D38B70] font-bold text-center mb-6">
        Meeting New Friends
      </h1>
      <ProfileCard />
    </main>
  );
}

