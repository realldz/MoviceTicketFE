export interface VnPayRequest {
    vnp_Version: string,
    vnp_TmnCode: string,
    vnp_Amount: number,
    vnp_Command: string,
    vnp_CreateDate: string,
    vnp_CurrCode: string,
    vnp_IpAddr: string,
    vnp_Locale: string,
    vnp_OrderInfo: string,
    vnp_OrderType: string,
    vnp_ReturnUrl: string,
    vnp_TxnRef: string,
    vnp_ExpireDate: string
    vnp_SecureHash: string

}