export const DashFunMessages = {
	/**
	 * payload: {
	 * 	value:number
	 * }
	 */
	loading: "loading",
	/**
	 * payload: {
	 * 	value:link
	 * }
	 */
	openTelegramLink: "openTelegramLink",

	/**
	 * payload: {
	 * 	invoiceUrl:string,
	 * 	paymentId:string,
	 * }
	 * 
	 * result:{
	 * 	state:"success"|"error",
	 *  data: {
	 * 		paymentId:string,
	 *  	status:"paid" | "canceled" | "failed"
	 * 	}
	 * }
	 */
	openInvoice: "openInvoice",

	/**
	 * payload:{},
	 * result:{
	 * 	state:"success"|"error"
	 * 	data:DashFunUser {
	 *	 	id: string,				 
			channelId: string	,	 
			displayName: string ,	 
			userName: string ,		 
			avatarUrl: string,		 
			from: number,			 
			createData: number,		 
			loginTime: number,		 
			logoffTime: number	,	 
	 * 	}
	 * }
	 */
	getUserProfile: "getUserProfile",
	/**
	 * payload:{
	 * 	gameId: string,
	 * 	title: string,
	 * 	desc: string,
	 * 	info: string,
	 * 	price: number,
	 * }
	 * 
	 * result:{
	 *	state:"success"|"error",
	 *	data:{
	 *		paymentId:string,
	 * 		invoiceLink:string,
	 *	}
	 * }
	 * 
	 */
	requestPayment: "requestPayment",

	/**
	 * payload:{
	 * 	key:string,
	 * 	data:object
	 * }
	 * 
	 * result:{
	 * 	state:"success"|"error",
	 * 	data: string
	 * }
	 */
	setData: "setData",

	/**
	 * payload:{
	 * 	key:string,
	 * }
	 * 
	 * result:{
	 * 	state:"success"|"error",
	 * 	data: string
	 * }
	 */
	getData: "getData",
}