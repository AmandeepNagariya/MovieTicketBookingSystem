using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Required for ToListAsync
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure; // Required for PageSizes etc.
using TicketBookingAppWithRazorPay.Data;

namespace TicketBooking.Controllers;

[ApiController]
[Route("api/pdf")]
public class PdfController : ControllerBase
{
    private readonly AppDbContext _context;

    public PdfController(AppDbContext context)
    {
        _context = context;
    }

    
    [HttpGet("movies")]
    public IActionResult Movies()
    {
        var data = _context.MovieSchedules.ToList();

        var pdf = Document.Create(doc =>
        {
            doc.Page(p =>
            {
                p.Content().Table(t =>
                {
                    t.ColumnsDefinition(c =>
                    {
                        c.RelativeColumn();
                        c.RelativeColumn();
                        c.RelativeColumn();
                    });

                    t.Header(h =>
                    {
                        h.Cell().Text("Movie");
                        h.Cell().Text("Theatre");
                        h.Cell().Text("Time");
                    });

                    foreach (var m in data)
                    {
                        t.Cell().Text(m.MovieName);
                        t.Cell().Text(m.TheatreName);
                        t.Cell().Text(m.ShowTime.ToString());
                    }
                });
            });
        });

        var ms = new MemoryStream();
        pdf.GeneratePdf(ms);
        return File(ms.ToArray(), "application/pdf", "Movies.pdf");
    }

    // --- FUNCTION 2: User Invoices ---
    [HttpGet("download-invoice/{userId}")]
    public async Task<IActionResult> DownloadInvoice(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found");

        // Explicitly join tables to get the data you need for the invoice
        var records = await _context.Payments
            .Where(p => p.UserId == userId)
            .Join(_context.MovieSchedules,
                p => p.MovieScheduleId,
                m => m.Id,
                (p, m) => new {
                    p.PaymentId,
                    p.Amount,
                    p.SeatNumbers,
                    p.PaidAt,
                    m.MovieName,
                    m.TheatreName
                })
            .ToListAsync(); 

        var pdf = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(50);
                page.Size(PageSizes.A4);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Verdana));

                // --- HEADER ---
                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("TICKET INVOICE").FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);
                        col.Item().Text($"Customer: {user.FullName}");
                        col.Item().Text($"Email: {user.Email}");
                    });

                    row.RelativeItem().AlignRight().Column(col =>
                    {
                        col.Item().Text("Cinema App").FontSize(14).Bold();
                        col.Item().Text($"Date: {DateTime.Now:dd MMM yyyy}");
                    });
                });

                // --- CONTENT TABLE ---
                page.Content().PaddingVertical(20).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(1);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Movie & Venue").Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Booking Date").Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Seats").Bold();
                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Price").Bold();
                    });

                    foreach (var record in records)
                    {
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Column(c => {
                            c.Item().Text(record.MovieName).Bold();
                            c.Item().Text(record.TheatreName).FontSize(8);
                        });
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(record.PaidAt.ToString("g") ?? "N/A");
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(record.SeatNumbers);
                        table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"₹{record.Amount}");
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                });
            });
        });

        using var ms = new MemoryStream();
        pdf.GeneratePdf(ms);
        return File(ms.ToArray(), "application/pdf", $"Invoice_{user.FullName}.pdf");
    }
}