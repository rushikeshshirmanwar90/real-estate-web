import { cookies } from "next/headers";

export const validateClient = async () => {
    const cookieStore = await cookies();
    const getCookie = cookieStore.get("client_auth_token")
    if (getCookie) {
        return true
    }
    return false
}