import { Trip } from "@/dto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { format } from "date-fns";
import { MapPin } from "lucide-react";

export default function DashboardTrips({
  trips,
  tripError,
}: {
  trips: Trip[];
  tripError: boolean;
}) {
  if (tripError) {
    return <div>Error loading trips</div>;
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent & Upcoming Trips</CardTitle>
        <CardDescription>
          Trips scheduled within a month's range
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div key={trip.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {trip.start_location} → {trip.end_location}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {trip.trip_type}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>
                    {format(new Date(trip.start_date), "dd MMM yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span>{format(new Date(trip.end_date), "dd MMM yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span>{trip.total_km} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Locations:</span>
                  <span className="text-right">{trip.location_visited}</span>
                </div>
              </div>

              <div className="pt-2 border-t space-y-1 text-sm">
                <div className="flex justify-between font-medium">
                  <span>Total Cost:</span>
                  <span>
                    ₹
                    {trip.total_fuel_cost +
                      trip.maintainance +
                      trip.permit +
                      trip.state_tax +
                      trip.toll_tax}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Profit:</span>
                  <span>₹{trip.profit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
