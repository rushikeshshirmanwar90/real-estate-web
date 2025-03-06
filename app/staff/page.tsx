import { AddStaffDialog } from '@/components/staff/add-staff-dialog'
import { StaffTable } from '@/components/staff/staff-table'
import React from 'react'

const Page = () => {
    return (
        <div>
            <div className="flex flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Staff</h2>
                        <AddStaffDialog />
                    </div>
                    <div className="mt-6">
                        <StaffTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
