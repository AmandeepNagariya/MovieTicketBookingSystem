using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketBookingAppWithRazorPay.Data;

namespace TicketBookingAppWithRazorPay.Controllers
{
    [ApiController]
    [Route("api/seats")] 
    public class SeatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeatsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{scheduleId}")]
        public async Task<IActionResult> GetSeats(int scheduleId)
        {
            var seats = await _context.Seats
                .Where(s => s.MovieScheduleId == scheduleId)
                .OrderBy(s => s.SeatNumber)
                .ToListAsync();

            if (!seats.Any()) return NotFound(new { message = "Seats not found" });

            return Ok(seats);
        }
    }
}