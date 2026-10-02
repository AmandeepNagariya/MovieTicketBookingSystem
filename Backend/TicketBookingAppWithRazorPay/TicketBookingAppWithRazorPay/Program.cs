using Microsoft.EntityFrameworkCore;
using QuestPDF.Infrastructure;
using TicketBookingAppWithRazorPay.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("TicketBookingWithRazorPayConstr"))
);

QuestPDF.Settings.License = LicenseType.Community;
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://movie-ticket-booking-system-psi-two.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseStaticFiles();

app.MapControllers();

app.Run();