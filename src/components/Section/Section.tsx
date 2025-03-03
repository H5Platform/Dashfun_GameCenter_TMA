import { Divider } from "@telegram-apps/telegram-ui";
import { FC } from "react";
import { Fragment } from "react/jsx-runtime";

const Section: FC<{ header?: string, children: React.ReactNode }> = ({ header, children }) => {
	return <div className="flex flex-col">
		{header && <div className="text-md pb-2" style={{ color: "var(--tgui--hint_color)" }}>{header}</div>}
		<div className=" rounded-2xl" style={{ backgroundColor: "var(--tgui--section_bg_color)" }}>
			{Array.isArray(children) ? children.map((child, index) => (
				<Fragment key={index}>
					{child}
					{index < children.length - 1 && <Divider />}
				</Fragment>
			)) : children}
		</div>

	</div>
}

export default Section;