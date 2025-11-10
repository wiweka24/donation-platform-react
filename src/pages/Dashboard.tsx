import { Link } from "react-router-dom";
import {
  useGetMyProfileQuery,
  useGetDonationsQuery,
} from "../services/apiService";

export function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfileQuery();
  const { data: donations, isLoading: donationsLoading } =
    useGetDonationsQuery();

  if (profileLoading || donationsLoading) {
    return <div>Loading your dashboard...</div>;
  }

  return (
    <div className="h-screen w-screen items-center flex flex-col justify-center">
      <h1>Welcome, {profile?.display_name}</h1>
      <p>
        Your OBS Widget URL:
        <Link
          to={`http://localhost:5173/widget/${profile?.widget_secret_token}`}
        >
          {" "}
          {`http://localhost:5173/widget/${profile?.widget_secret_token}`}
        </Link>
      </p>

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
