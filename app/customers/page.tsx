import { CustomerTable } from '@/components/customers/customer-table'
import { AddCustomerDialog } from '@/components/customers/add-customer-dialog'
import React from 'react'

const page = () => {
    return (
        <div>
            <div className="flex flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                        <AddCustomerDialog />
                    </div>
                    <div className="mt-6">
                        <CustomerTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
