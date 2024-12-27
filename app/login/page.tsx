"use client"
import Login from '@/components/Login'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"
import { useAuthStore } from '@/hooks/use-auth'

const Page = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore()
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [])

    return (
        <div>
            <Login />
        </div>
    )
}

export default Page