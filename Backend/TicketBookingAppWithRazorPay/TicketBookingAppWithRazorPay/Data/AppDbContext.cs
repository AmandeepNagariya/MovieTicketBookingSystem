using Microsoft.EntityFrameworkCore;
using TicketBookingAppWithRazorPay.Models;

namespace TicketBookingAppWithRazorPay.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<MovieSchedule> MovieSchedules { get; set; }
    public DbSet<Seat> Seats { get; set; }
    public DbSet<Payments> Payments { get; set; }
}