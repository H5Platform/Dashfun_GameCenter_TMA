export const toTimeString = (days: number, hours: number, minutes: number, seconds: number) => {
	let ret = "";
	if (days > 1) {
		ret += days + " days "
	} else if (days == 1) {
		ret += days + " day "
	}
	ret += `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	return ret;
}