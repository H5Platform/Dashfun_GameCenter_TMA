import { TGLink } from "@/utils/DashFunApi";

type GameDataParams = {
	id: string;
	name: string;
	desc: string;
	url: string;
	genre: number[];
	iconUrl: string;
	time: number;

}

class GameData {
	id: string = "";
	name: string = "";
	desc: string = "";
	url: string = "";
	genre: number[] = [];
	iconUrl: string = "";
	time: number = 0;

	tgLink(): string {
		// return "https://t.me/DashFunBot/Games?startapp=" + this.id;
		return TGLink.gameLink(this.id)
	}

	constructor(data: GameDataParams) {
		const { id, name, desc, url, genre, iconUrl, time } = data;
		this.id = id;
		this.name = name;
		this.desc = desc;
		this.url = url;
		this.genre = genre;
		this.iconUrl = iconUrl;
		this.time = time;
	}
}

export { GameData }
export type { GameDataParams }