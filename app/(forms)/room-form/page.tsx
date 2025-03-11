"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { RoomsEditableCard } from "@/components/editable-cards/roomEditCard"
import TopHeader from "@/components/TopHeader"
import axios from "axios"
import domain from "@/components/utils/domain"
import { successToast } from "@/components/toasts"
import { FlatInfo, Room } from "./type"

const RoomForm = () => {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("projectId") || "";
    const buildingId = searchParams.get("buildingId") || "";
    const flatId = searchParams.get("flatId") || "";
    const router = useRouter();

    const [flatInfo, setFlatInfo] = useState<FlatInfo>({
        projectId: projectId,
        buildingId: buildingId,
        flatId: flatId,
        rooms: [],
    })

    const handleRoomsChange = (rooms: Room[]) => {
        setFlatInfo((prev) => ({
            ...prev,
            rooms,
        }))
    }

    const isFormValid = () => {
        const hasRequiredIds =
            flatInfo.projectId.trim() !== "" &&
            flatInfo.buildingId.trim() !== "" &&
            flatInfo.flatId.trim() !== "";

        // Check if there's at least one room (optional, depending on your requirements)
        const hasRooms = flatInfo.rooms.length > 0;

        const hasValidRooms = flatInfo.rooms.length === 0 || flatInfo.rooms.every(room =>
            room.title.trim() !== "" &&
            room.type.trim() !== "" &&
            room.images.length > 0
        );

        return hasRequiredIds && hasRooms && hasValidRooms;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(flatInfo)

        try {
            const res = await axios.post(`${domain}/api/room-info`, flatInfo);
            const data = res.data;

            if (data) {
                successToast("Flat Rooms are added successfully");
                router.push("/projects");
            }

        } catch (error: any) {
            console.log("something went wrong can't add the project");
            console.error(error.error)
        }

    }

    return (
        <div className="container mx-auto p-6 space-y-8">

            <form onSubmit={handleSubmit} >
                <TopHeader
                    buttonText={"Add Room Details"}
                    tagTitle="Project"
                    title={`set up buildings`}
                    buttonDisable={false}
                />

                <div className="space-y-6">
                    <RoomsEditableCard rooms={flatInfo.rooms} onRoomsChange={handleRoomsChange} />
                </div>
            </form>

        </div>
    )

}

export default RoomForm;