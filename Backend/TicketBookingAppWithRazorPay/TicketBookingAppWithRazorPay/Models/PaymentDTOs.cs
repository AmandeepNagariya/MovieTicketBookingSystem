namespace TicketBookingAppWithRazorPay.Models
{
    // Fixes the 415 error for order creation
    public class OrderRequest
    {
        public decimal Amount { get; set; }
    }
}