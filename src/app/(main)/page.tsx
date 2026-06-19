import ArtworkList from "@/components/home/ArtworkList";
import SidebarHome from "@/components/home/SidebarHome";

export default function Home() {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 p-6 w-full">
      <div className="flex-1">
        <ArtworkList />
      </div>
      <div className="w-full lg:w-1/4">
        <SidebarHome />
      </div>
    </div>
  );
}
