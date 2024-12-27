import domain from "@/components/domain";

export const handleLogin = async (email: string, password: string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/clients/login`, {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        })
        if (res.ok) {
            const data = await res.json();
            console.log(data.message);
        } else {
            console.error("Something went wrong")
        }
    } catch (error: any) {
        console.error(`Error : ${error.message}`)
    }

}