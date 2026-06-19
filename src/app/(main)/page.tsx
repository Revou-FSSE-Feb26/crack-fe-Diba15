import ArtworkList from "@/components/home/ArtworkList";
import SidebarHome from "@/components/home/SidebarHome";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_236px] gap-6 p-6">
      <ArtworkList />
      <SidebarHome />
    </div>
  );
}
