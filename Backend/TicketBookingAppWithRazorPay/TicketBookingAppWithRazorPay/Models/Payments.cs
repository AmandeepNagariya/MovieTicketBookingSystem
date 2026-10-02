namespace TicketBookingAppWithRazorPay.Models
{
     public class Payments
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MovieScheduleId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentId { get; set; }
        public bool IsPaid { get; set; }
        public DateTime PaidAt { get; set; }
        public string SeatNumbers { get; set; }
    }
}
