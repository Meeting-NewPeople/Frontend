import TopNav from "./components/TopNav";
import CardSlider from "./components/CardSlider";
import BottomNav from "./components/BottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] pt-20 pb-20">
      {/* 상단 네비게이션 */}
      <TopNav />

      {/* 본문 */}
      <h2 className="text-2xl text-[#D38B70] font-semibold text-center mb-4">
        Meeting New Friends
      </h2>
      <CardSlider />
      <BottomNav />
    </main>
  );
}
