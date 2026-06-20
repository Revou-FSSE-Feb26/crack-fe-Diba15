import ArtworkList from "@/components/home/ArtworkList";
import SidebarHome from "@/components/home/SidebarHome";

export default function Home() {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center gap-6 p-6 w-full">
      <div className="flex-1 max-w-3xl">
        <ArtworkList />
      </div>
      <div className="w-full lg:w-1/4">
        <SidebarHome />
      </div>
    </div>
  );
}
