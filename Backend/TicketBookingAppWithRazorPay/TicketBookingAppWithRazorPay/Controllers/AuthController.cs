using Microsoft.AspNetCore.Mvc;
using TicketBookingAppWithRazorPay.Data;
using TicketBookingAppWithRazorPay.Models;

namespace TicketBookingAppWithRazorPay.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] UserRegisterDto dto)
    {
        string imagePath = "";

        if (dto.ProfilePicture != null)
        {
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid() + Path.GetExtension(dto.ProfilePicture.FileName);
            var filePath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ProfilePicture.CopyToAsync(stream);
            }

            imagePath = $"/images/{fileName}";
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role ?? "User",
            ProfilePicture = imagePath,
            RegisteredBy = string.IsNullOrEmpty(dto.RegisteredBy) ? "Self" : dto.RegisteredBy
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

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
}