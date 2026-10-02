namespace TicketBookingAppWithRazorPay.Models
{
    public class MovieSchedule
    {
        public int Id { get; set; }
        public string MovieName { get; set; }
        public string TheatreName { get; set; }
        public DateTime ShowTime { get; set; }
        public decimal Price { get; set; }
    }
}
