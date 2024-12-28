import { DashboardCards } from "@/components/DashboardCard";

export default function Page() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4 px-2 pt-2">
      <DashboardCards
        title="Total Users"
        isGreen={true}
        value={300}
        description="+20 users from last month"
      />
      <DashboardCards
        title="Total Leads"
        isGreen={false}
        value={200}
        description="-20 leads from last month"
      />
      <DashboardCards
        title="Total Projects"
        isGreen={true}
        value={30}
        description="+0 projects from last month"
      />
      <DashboardCards
        title="Total Staff"
        isGreen={true}
        value={10}
        description="+5 staff from last month"
      />
    </div>
  );
}
