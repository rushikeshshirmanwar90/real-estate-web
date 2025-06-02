"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReferenceLeadsTable } from "@/components/reference-leads-table";
import { LeadsTable } from "@/components/leads-table";
import { ReferralEntry } from "@/types/reference";
import axios from "axios";
import domain from "@/components/utils/domain";

export default function LeadsDataPage() {
    const [referenceLeads, setReferenceLeads] = useState<ReferralEntry[]>([]);
    // const [leads, setLeads] = useState<ReferralEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("reference-leads");

    // Example fetch logic (replace with your actual API endpoint)
    useEffect(() => {
        const fetchReferenceLeads = async () => {
            try {
                const res = await axios.get(`${domain}/api/reference-leads?clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}`);
                const data = res.data.referenceLeads;
                // console.log(data);
                setReferenceLeads(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error fetching reference leads:", error.message);
                } else {
                    console.error("Unexpected error:", error);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchReferenceLeads();
    }, [loading]);


    useEffect(() => {
        // Reset loading state when the active tab changes  
        setLoading(true);
        const fetchReferenceLeads = async () => {
            try {
                const res = await axios.get(`${domain}/api/leads?clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}`);
                const data = res.data.referenceLeads;
                setReferenceLeads(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error fetching reference leads:", error.message);
                } else {
                    console.error("Unexpected error:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchReferenceLeads();
    }
        , [activeTab, loading]);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Leads Management Dashboard</h1>

            <Tabs defaultValue="reference-leads" onValueChange={setActiveTab} value={activeTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="reference-leads">Reference Leads</TabsTrigger>
                    <TabsTrigger value="leads">Leads</TabsTrigger>
                </TabsList>

                <TabsContent value="reference-leads" className="mt-0">
                    <ReferenceLeadsTable data={referenceLeads} />
                </TabsContent>

                <TabsContent value="leads" className="mt-0">
                    <LeadsTable data={[]} /> {/* Replace with actual leads data */}
                </TabsContent>
            </Tabs>
        </div>
    );
}