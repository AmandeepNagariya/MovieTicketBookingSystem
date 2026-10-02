using Microsoft.AspNetCore.Mvc;
using TicketBookingAppWithRazorPay.Data;
using TicketBookingAppWithRazorPay.Models;

namespace TicketBookingAppWithRazorPay.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("users")]
    public IActionResult GetUsers(int adminId)
    {
        var admin = _context.Users.Find(adminId);

        if (admin == null || admin.Role != "Admin")
            return Unauthorized();

        return Ok(_context.Users.Where(x => x.Role == "User").ToList());
    }

    [HttpPost("add-user")]
    public async Task<IActionResult> AddUser(User u)
    {
        u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(u.PasswordHash);
        u.Role = "User";
        u.RegisteredBy = "Admin";

        _context.Users.Add(u);
        await _context.SaveChangesAsync();

        return Ok(u);
    }

    [HttpPost("impersonate/{id}")]
    public IActionResult Impersonate(int id)
    {
        var user = _context.Users.Find(id);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            user.ProfilePicture,
            user.RegisteredBy,
            user.CreatedAt

        });
    }

    [HttpPost("movie")]
    public async Task<IActionResult> AddMovie(MovieSchedule m)
    {
        _context.MovieSchedules.Add(m);
        await _context.SaveChangesAsync();

        var seats = new List<Seat>();
        char[] rows = { 'A', 'B', 'C', 'D', 'E', 'F' };

        foreach (var r in rows)
        {
            for (int i = 1; i <= 10; i++)
            {
                seats.Add(new Seat
                {
                    MovieScheduleId = m.Id,
                    SeatNumber = $"{r}{i}",
                    IsBooked = false
                });
            }
        }

        _context.Seats.AddRange(seats);
        await _context.SaveChangesAsync();

        return Ok(m);
    }

    [HttpGet("movies")]
    public IActionResult GetMovies()
    {
        return Ok(_context.MovieSchedules.ToList());
    }

    [HttpGet("analytics")]
    public IActionResult GetAnalytics(int adminId)
    {
        var admin = _context.Users.Find(adminId);
        if (admin == null || admin.Role != "Admin") return Unauthorized();

        // 1. Total Stats
        var totalUsers = _context.Users.Count();
        var revenue = _context.Payments.Where(p => p.IsPaid).Sum(x => x.Amount);

        // 2. Revenue over last 7 days (Area Chart)
        var revenueTrend = _context.Payments
            .Where(p => p.IsPaid && p.PaidAt >= DateTime.Now.AddDays(-7))
            .GroupBy(p => p.PaidAt.Date)
            .Select(g => new { date = g.Key.ToString("dd MMM"), amount = g.Sum(x => x.Amount) })
            .ToList();

        // 3. Bookings per Movie (Bar Chart)
        var movieData = _context.Payments
            .Where(p => p.IsPaid)
            .Join(_context.MovieSchedules, p => p.MovieScheduleId, m => m.Id, (p, m) => new { m.MovieName, p.Amount })
            .GroupBy(x => x.MovieName)
            .Select(g => new { name = g.Key, value = g.Count() })
            .ToList();

        // 4. User Registration Source (Pie Chart)
        var userSources = _context.Users
            .GroupBy(u => u.RegisteredBy ?? "Direct")
            .Select(g => new { name = g.Key, value = g.Count() })
            .ToList();

        return Ok(new
        {
            totalUsers,
            revenue,
            revenueTrend,
            movieData,
            userSources
        });
    }
}