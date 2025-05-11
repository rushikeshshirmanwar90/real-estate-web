"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReferenceLeadsTable } from "@/components/reference-leads-table"
import { LeadsTable } from "@/components/leads-table"

// Demo data based on your data structure
const demoReferenceLeads = [
    {
        clientId: "C001",
        referenceCustomer: {
            id: "RC001",
            name: "John Doe",
            contactNumber: "9876543210",
        },
        leads: [
            { id: "L001", name: "Alice Smith", contactNumber: "1234567890" },
            { id: "L002", name: "Bob Johnson", contactNumber: "2345678901" },
        ],
    },
    {
        clientId: "C002",
        referenceCustomer: {
            id: "RC002",
            name: "Jane Smith",
            contactNumber: "8765432109",
        },
        leads: [
            { id: "L003", name: "Charlie Brown", contactNumber: "3456789012" },
            { id: "L004", name: "Diana Prince", contactNumber: "4567890123" },
        ],
    },
    {
        clientId: "C003",
        referenceCustomer: {
            id: "RC003",
            name: "Robert Williams",
            contactNumber: "7654321098",
        },
        leads: [
            { id: "L005", name: "Eva Green", contactNumber: "5678901234" },
            { id: "L006", name: "Frank Castle", contactNumber: "6789012345" },
            { id: "L007", name: "Grace Lee", contactNumber: "7890123456" },
        ],
    },
]

const demoLeads = [
    {
        name: "Michael Scott",
        phone: "5551234567",
        projectDetails: {
            projectName: "Dunder Heights",
            projectId: "P001",
        },
        interestedType: "building",
        buildingDetails: {
            buildingName: "Tower A",
            buildingId: "B001",
            flatName: "Penthouse 1",
            flatId: "F001",
        },
    },
    {
        name: "Jim Halpert",
        phone: "5552345678",
        projectDetails: {
            projectName: "Scranton Estates",
            projectId: "P002",
        },
        interestedType: "rowhouse",
        rowHouseDetails: {
            rowHouseName: "Villa 5",
            rowHouseId: "R001",
        },
    },
    {
        name: "Pam Beesly",
        phone: "5553456789",
        projectDetails: {
            projectName: "Dunder Heights",
            projectId: "P001",
        },
        interestedType: "building",
        buildingDetails: {
            buildingName: "Tower B",
            buildingId: "B002",
            flatName: "Apartment 3B",
            flatId: "F023",
        },
    },
    {
        name: "Dwight Schrute",
        phone: "5554567890",
        projectDetails: {
            projectName: "Beet Farm Estates",
            projectId: "P003",
        },
        interestedType: "rowhouse",
        rowHouseDetails: {
            rowHouseName: "Farmhouse 2",
            rowHouseId: "R007",
        },
    },
]

export default function LeadsDataPage() {
    const [activeTab, setActiveTab] = useState("reference-leads")

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Leads Management Dashboard</h1>

            <Tabs defaultValue="reference-leads" onValueChange={setActiveTab} value={activeTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="reference-leads">Reference Leads</TabsTrigger>
                    <TabsTrigger value="leads">Leads</TabsTrigger>
                </TabsList>

                <TabsContent value="reference-leads" className="mt-0">
                    <ReferenceLeadsTable data={demoReferenceLeads} />
                </TabsContent>

                <TabsContent value="leads" className="mt-0">
                    <LeadsTable data={demoLeads} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
