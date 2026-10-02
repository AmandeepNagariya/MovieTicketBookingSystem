import api from "../../services/api";

export default function Payment({ movie, selectedSeats, totalAmount }) {
  const pay = async () => {
    try {

const numericAmount = Number(totalAmount); 

const orderRes = await api.post("/payment/create-order", { 
  amount: numericAmount 
});

      // Accessing 'id' and 'amount' directly from your updated controller return
      const options = {
        key: "rzp_test_STtAAjNYUbAOuD", // Your active KeyId
        amount: orderRes.data.amount * 100, // Razorpay amount in paise
        currency: "INR",
        name: "Cinema Ticket",
        description: `${movie.movieName} - Seats: ${selectedSeats.join(",")}`,
        order_id: orderRes.data.id, // Mandatory for the "Pay Now" interface
        handler: async function (res) {
          // 2. Verify payment and update SQL tables (IsBooked = 1)
          try {
            const userData = JSON.parse(localStorage.getItem("user"));
            
            await api.post("/payment/verify", {
              userId: userData.id,
              movieScheduleId: movie.id,
              amount: totalAmount,
              paymentId: res.razorpay_payment_id,
              seatNumbers: selectedSeats.join(",")
            });

            alert("Booking Confirmed! 🎉 Check your Payment Records.");
            window.location.href = "/user/payments";
          } catch (verifyErr) {
            console.error("Verification Error:", verifyErr);
            alert("Payment successful, but failed to update booking. Contact support.");
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("user"))?.fullName || "Guest",
          email: JSON.parse(localStorage.getItem("user"))?.email || "",
        },
        theme: { color: "#0d6efd" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open(); // Triggers the Razorpay Modal overlay
    } catch (err) {
      console.error("Payment Error:", err);
      // Alerts if the backend 'create-order' fails
      alert("Could not initialize payment. Check backend connection and JSON model.");
    }
  };

  return (
    <button className="btn btn-success btn-lg px-5 fw-bold" onClick={pay}>
      Proceed to Pay ₹{totalAmount}
    </button>
  );
}