import CardSlider from "./components/CardSlider";
import BottomNav from "./components/BottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] pb-20">
      <h1 className="text-3xl text-[#D38B70] font-bold text-center pt-10">
        Meeting New Friends
      </h1>
      <CardSlider />
      <BottomNav />
    </main>
  );
}
