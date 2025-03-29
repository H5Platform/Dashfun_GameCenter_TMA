import { FC } from "react";

const DFLabel: FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="flex items-center bg-gradient-to-b from-[#F0404070] to-[#F0404050]
    rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm relative">
        <div className="absolute inset-[1px] rounded-full ring-[1px] ring-[#F04040]/30 pointer-events-none"></div>
        <div className=" text-white w-full">{children}</div>
    </div>
}

export default DFLabel;
