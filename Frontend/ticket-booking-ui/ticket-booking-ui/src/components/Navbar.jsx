import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="d-flex justify-content-between align-items-center bg-primary text-white px-4 py-2">

      <h5>🎬 TicketBooking</h5>

      <div className="d-flex align-items-center gap-3">

        <span>Hi {user?.fullName}</span>

        <ProfileDropdown user={user} />

      </div>
    </div>
  );
}