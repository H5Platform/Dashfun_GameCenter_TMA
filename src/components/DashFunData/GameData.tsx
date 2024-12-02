import { TGLink } from "@/utils/DashFunApi";

type GameDataParams = {
	id: string;
	name: string;
	desc: string;
	url: string;
	genre: number[];
	iconUrl: string;
	time: number;
	openTime: number;
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
	openTime: number = 0;

	tgLink(): string {
		// return "https://t.me/DashFunBot/Games?startapp=" + this.id;
		return TGLink.gameLink(this.id)
	}

	constructor(data: GameDataParams) {
		const { id, name, desc, url, genre, iconUrl, time, openTime, mainPicUrl, logoUrl } = data;
		this.id = id;
		this.name = name;
		this.desc = desc;
		this.url = url;
		this.genre = genre;
		this.iconUrl = iconUrl;
		this.time = time;
		this.mainPicUrl = mainPicUrl;
		this.logoUrl = logoUrl;
		this.openTime = openTime;
	}
}

class GameDataList {
	data: GameData[] = [];
	page: number = 0;
	size: number = 0;
	total_pages: number = 0;

	constructor(data: GameData[], page: number, size: number, total_pages: number) {
		this.data = data;
		this.page = page;
		this.size = size;
		this.total_pages = total_pages;
	}
}

export { GameData, GameDataList }
export type { GameDataParams }