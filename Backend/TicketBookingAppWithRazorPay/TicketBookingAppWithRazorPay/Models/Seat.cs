namespace TicketBookingAppWithRazorPay.Models
{
    public class Seat
    {
        public int Id { get; set; }
        public int MovieScheduleId { get; set; }
        public string SeatNumber { get; set; }
        public bool IsBooked { get; set; }
    }
}
