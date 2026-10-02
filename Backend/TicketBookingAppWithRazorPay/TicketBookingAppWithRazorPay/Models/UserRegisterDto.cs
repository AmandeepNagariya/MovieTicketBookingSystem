using Microsoft.AspNetCore.Http;

namespace TicketBookingAppWithRazorPay.Models;
public class UserRegisterDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public string RegisteredBy { get; set; }
    public IFormFile ProfilePicture { get; set; } // 🔥 FILE
}