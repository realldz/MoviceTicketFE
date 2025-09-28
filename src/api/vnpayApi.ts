import { VnPayRequest } from "../types/vnpay";

// vnpayApi.ts (frontend, React/Vite)
const BASE_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const SECRET_KEY = import.meta.env.VITE_VNPAY_SECRET_KEY;   // lưu ý Vite cần prefix VITE_
const MERCHANT_ID = import.meta.env.VITE_VNPAY_MERCHANT_ID;
const RETURN_URL = import.meta.env.VITE_VNPAY_RETURN_URL;

const textEncode = (s: string) => new TextEncoder().encode(s);
const toHex = (buf: ArrayBuffer) =>
    [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");

function buildSortedQuery(data: Record<string, string | number>): string {
    const sp = new URLSearchParams();
    Object.keys(data).sort().forEach(k => sp.append(k, String(data[k])));
    return sp.toString(); // giống http_build_query
}

async function hmacSha512(secret: string, data: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        textEncode(secret),
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, textEncode(data));
    return toHex(sig);
}

const vnpayApi = {

    // Trả về URL để bạn redirect
    payUrl: async (req: VnPayRequest) => {
        // bỏ các field hash nếu có
        req.vnp_Version = "2.1.0";
        req.vnp_Command = "pay";
        req.vnp_TmnCode = MERCHANT_ID;
        req.vnp_Amount = req.vnp_Amount * 26000 * 100;
        req.vnp_ReturnUrl = RETURN_URL;
        req.vnp_CurrCode = 'VND';
        req.vnp_IpAddr = '127.0.0.1';
        req.vnp_Locale = 'vn';
        req.vnp_CreateDate = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
        req.vnp_OrderType = 'other';

        const baseParams: Record<string, string | number> = { ...req };

        const toSign = buildSortedQuery(baseParams);
        const vnp_SecureHash = await hmacSha512(SECRET_KEY, toSign);

        const finalParams = new URLSearchParams({
            ...Object.fromEntries(Object.entries(baseParams).map(([k, v]) => [k, String(v)])),
            vnp_SecureHashType: "HmacSHA512",
            vnp_SecureHash
        });

        return `${BASE_URL}?${finalParams.toString()}`;
    },

    // Thực hiện chuyển hướng
    redirect: async (req: VnPayRequest) => {
        const url = await vnpayApi.payUrl(req);
        window.location.href = url;
    }
};

export default vnpayApi;
