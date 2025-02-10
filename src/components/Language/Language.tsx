import { createContext, FC, PropsWithChildren, useContext, useState } from "react";

const en: { [key: string]: string | string[] } = {
	"GameListType": [
		"Play Again",
		"Try Something New",
		"Most Popular",
		"Our Favorites",
		"Banner",
	],
}

export const LangKeys = {
	GameListType: "GameListType",
}

let currentLang = en;

const LanguageContext = createContext<{
	get: (key: string) => string | string[]
} | null>(null);

export const LanguageProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [lang, _] = useState(currentLang);

	const get = (key: string): string | string[] => {
		return lang[key];
	}

	return (
		<LanguageContext.Provider value={{ get: get }}>
			{children}
		</LanguageContext.Provider>
	);
}

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageContextProvider");
	}
	return [context.get];
}

export const L = ({ langKey, index = 0 }: { langKey: string, index?: number }) => {
	const [get] = useLanguage();

	const l = get(langKey);
	if (l == null) return null;
	if (Array.isArray(l)) {
		return l[index];
	} else {
		return l;
	}
}