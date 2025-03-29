type DFTextProps = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler | undefined;
    size?: "xs" | "sm" | "m" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    weight: "1" | "2" | "3"
    color?: string;
    className?: string;
}

const DFText: React.FC<DFTextProps> = ({ children, onClick, weight, size = "sm", color = "white", className }) => {

    let fontWeight = 400;
    switch (weight) {
        case "1":
            fontWeight = 400;
            break;
        case "2":
            fontWeight = 600;
            break;
        case "3":
            fontWeight = 700;
            break;
        default:
            fontWeight = 400;
    }

    return <div className={`text-${size} ${className == null ? "" : className}`} style={{
        fontWeight: fontWeight,
        color: color,
    }}
        onClick={onClick}>
        {children}
    </div>
}

export default DFText;
export type { DFTextProps }