import { GameApi } from "@/utils/DashFunApi";
import DBMgr from "../DBMgr/DBMgr";
import Mutex from "../Mutex/Mutex";

export class GameSaveData {
    id: string = "";
    data: { [key: string]: string } = {};
    timestamp: number = Date.now();

    constructor(savedata?: any) {
        if (savedata) {
            this.id = savedata.id;
            this.data = savedata.data;
            this.timestamp = savedata.timestamp;
        }
    }

    get(key: string): string {
        return this.data[key] || "";
    }
    set(key: string, value: string): void {
        this.data[key] = value;
    }
}

export default class GameSaveMgr {
    private static instance: GameSaveMgr;

    private savedata: GameSaveData | null = null;
    private mutex = new Mutex();

    public static getInstance(): GameSaveMgr {
        if (!GameSaveMgr.instance) {
            GameSaveMgr.instance = new GameSaveMgr();
        }
        return GameSaveMgr.instance;
    }

    private constructor() {
        window.addEventListener('beforeunload', () => {
            console.log("saving data....");
            this.saveGameSaveData();
        });
    }

    public async getGameSaveData(userId: string, userToken: string, gameId: string): Promise<GameSaveData> {
        const release = await this.mutex.acquire();
        try {
            const saveId = this.toSaveId(userId, gameId);
            if (this.savedata == null) {
                const dbSaved = await this.loadGameSaveData(userId, gameId);
                const serverSaved = await GameApi.getData(gameId, userToken, "gamesave");

                

                if (this.savedata == null) {
                    this.savedata = new GameSaveData();
                    this.savedata.id = saveId; 
                }
            }
            return this.savedata;
        } finally {
            release();
        }
    }

    public async saveGameSaveData(): Promise<void> {
        if (this.savedata == null) {
            return;
        }
        await this.saveGameSaveDataToDB(this.savedata);
    }

    private async loadGameSaveData(userId: string, gameId: string): Promise<GameSaveData | null> {
        // Implement the logic to load game save data here
        const store = DBMgr.getInstance().getGameSaveStore();
        if (store == null) {
            return null;
        }
        const saveId = this.toSaveId(userId, gameId);
        const request = store.get(saveId);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (request.result != null) {
                    const data = new GameSaveData(request.result);
                    resolve(data);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    private async saveGameSaveDataToDB(data: GameSaveData): Promise<void> {
        const store = DBMgr.getInstance().getGameSaveStore('readwrite');
        if (store == null) {
            return;
        }
        const request = store.put(data);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = () => {
                reject(request.error);
            };
        }
        );
    }

    private toSaveId(userId: string, gameId: string): string {
        return `${userId}-${gameId}`;
    }

}