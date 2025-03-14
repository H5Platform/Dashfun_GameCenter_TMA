import { Divider } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import { Fragment } from "react/jsx-runtime";

const Section: FC<{ header?: string, disableDivider?: boolean, children: React.ReactNode }> = (
	{ header, disableDivider, children }) => {
	return <div className="flex flex-col w-full">
		{header && <div className="text-md pb-2" style={{ color: "var(--tgui--hint_color)" }}>{header}</div>}
		<div className=" rounded-2xl" style={{ backgroundColor: "var(--tgui--section_bg_color)" }}>
			{Array.isArray(children) ? children.map((child, index) => (
				<Fragment key={index}>
					{child}
					{index < children.length - 1 && (!disableDivider) && <Divider />}
				</Fragment>
			)) : children
			}
		</div>
	</div>
}

export default Section;