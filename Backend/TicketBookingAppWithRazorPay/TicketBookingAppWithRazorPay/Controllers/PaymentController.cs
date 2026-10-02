using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using Microsoft.EntityFrameworkCore;
using TicketBookingAppWithRazorPay.Data;
using TicketBookingAppWithRazorPay.Models;

namespace TicketBookingAppWithRazorPay.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _context;

    public PaymentController(IConfiguration config, AppDbContext context)
    {
        _config = config;
        _context = context;
    }

    [HttpPost("create-order")]
    public IActionResult CreateOrder([FromBody] OrderRequest request)
    {
        try
        {
            // 1. Validate Keys are loading
            string keyId = _config["Razorpay:KeyId"];
            string keySecret = _config["Razorpay:KeySecret"];

            if (string.IsNullOrEmpty(keyId) || string.IsNullOrEmpty(keySecret))
            {
                return StatusCode(500, "Razorpay keys are missing in appsettings.json");
            }

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            // 2. FORCE CAST TO INT (Razorpay strictly wants integer Paise)
            // Example: 450.00 becomes 45000
            int amountInPaise = Convert.ToInt32(request.Amount * 100);

            Dictionary<string, object> options = new Dictionary<string, object>
            {
                { "amount", amountInPaise },
                { "currency", "INR" },
                { "receipt", "order_rcpt_" + DateTime.Now.Ticks }
            };

            Order order = client.Order.Create(options);

            // Return a clean object for React
            return Ok(new
            {
                id = order["id"].ToString(),
                amount = request.Amount
            });
        }
        catch (Exception ex)
        {
            // This will show the actual error (e.g., "Bad Request", "Unauthorized") in your browser console
            return StatusCode(500, $"Razorpay SDK Error: {ex.Message}");
        }
    }

    [HttpPost("verify")]
    public async Task<IActionResult> Verify([FromBody] Payments p)
    {
        try
        {
            p.IsPaid = true;
            p.PaidAt = DateTime.UtcNow;

            var seatList = p.SeatNumbers.Split(',');

            // Update IsBooked status in SQL
            var seats = await _context.Seats
                .Where(s => seatList.Contains(s.SeatNumber) && s.MovieScheduleId == p.MovieScheduleId)
                .ToListAsync();

            foreach (var s in seats)
                s.IsBooked = true;

            _context.Payments.Add(p);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Success", paymentId = p.PaymentId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Database Error: {ex.Message}");
        }
    }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPayments(int userId)
        {
            var records = await _context.Payments
                .Where(p => p.UserId == userId)
                .Join(_context.MovieSchedules,
                    payment => payment.MovieScheduleId,  // Foreign Key in Payments
                    schedule => schedule.Id,             // Primary Key in MovieSchedules
                    (payment, schedule) => new {
                        id = payment.Id,
                        paymentId = payment.PaymentId,
                        amount = payment.Amount,
                        seatNumbers = payment.SeatNumbers,
                        movieName = schedule.MovieName // Fetching the name directly from the joined table
                    })
                .OrderByDescending(p => p.id)
                .ToListAsync();

            if (records == null || !records.Any())
                return Ok(new List<object>()); // Return empty list instead of 404 for better UX

            return Ok(records);
        }
    }