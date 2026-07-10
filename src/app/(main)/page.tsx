import ArtworkList from "@/components/home/ArtworkList";
import HomeHero from "@/components/home/HomeHero";
import SidebarHome from "@/components/home/SidebarHome";

export default function Home() {
	return (
		<div className="flex flex-col max-w-6xl w-full mx-auto p-4">
			<HomeHero />
			<div className="flex flex-col-reverse lg:flex-row justify-center gap-6 p-6 w-full max-w-6xl mx-auto">
				<div className="flex-1 max-w-3xl">
					<ArtworkList />
				</div>
				<div className="w-full lg:w-1/4">
					<SidebarHome />
				</div>
			</div>
		</div>
	);
}
