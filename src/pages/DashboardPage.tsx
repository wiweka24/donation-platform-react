import { Link } from "react-router-dom";
import {
  useGetMyProfileQuery,
  useGetDonationsQuery,
} from "../services/apiService";

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfileQuery();
  const { data: donations, isLoading: donationsLoading } =
    useGetDonationsQuery();
  const widgetUrl = `http://localhost:5173/widget/index.html?token=${profile?.widget_secret_token}`;
  console.log(profile);

  if (profileLoading || donationsLoading) {
    return <div>Loading your dashboard...</div>;
  }

  return (
    <div className="items-start flex flex-col justify-center">
      <h1>Welcome, {profile?.display_name}</h1>
      <p>Your OBS Widget URL:</p>
      <Link to={widgetUrl}> {widgetUrl}</Link>

      <p>Your Live Donations</p>
      <div className="h-max">
        {donations?.map((donation) => (
          <div key={donation.id} className="border">
            <p>
              <strong>{donation.donor_name}</strong> donated{" "}
              <strong>{donation.amount_cents}</strong>
            </p>
            <p>{donation.donor_message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
