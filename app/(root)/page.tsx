import { DashboardCalender } from "@/components/DashboardCalender";
import { RadialChart } from "@/components/RadialChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = async () => {
  const markedDates = [
    new Date(2024, 11, 10),
    new Date(2024, 11, 15),
    new Date(2024, 11, 20),
  ];

  return (
    <div className="flex gap-4">
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle>Important Events</CardTitle>
            <CardDescription>
              Click on the date to see the event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCalender markedDates={markedDates} />
          </CardContent>
        </Card>

        <RadialChart />
    </div>
  );
};

export default Dashboard;
