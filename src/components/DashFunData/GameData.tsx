import { TGLink } from "@/utils/DashFunApi";

type GameDataParams = {
	id: string;
	name: string;
	desc: string;
	url: string;
	genre: number[];
	iconUrl: string;
	time: number;
	logoUrl: string;
	mainPicUrl: string;
}

class GameData {
	id: string = "";
	name: string = "";
	desc: string = "";
	url: string = "";
	logoUrl: string = "";
	mainPicUrl: string = "";
	genre: number[] = [];
	iconUrl: string = "";
	time: number = 0;

	tgLink(): string {
		// return "https://t.me/DashFunBot/Games?startapp=" + this.id;
		return TGLink.gameLink(this.id)
	}

	constructor(data: GameDataParams) {
		const { id, name, desc, url, genre, iconUrl, time, mainPicUrl, logoUrl } = data;
		this.id = id;
		this.name = name;
		this.desc = desc;
		this.url = url;
		this.genre = genre;
		this.iconUrl = iconUrl;
		this.time = time;
		this.mainPicUrl = mainPicUrl;
		this.logoUrl = logoUrl
	}
}

export { GameData }
export type { GameDataParams }