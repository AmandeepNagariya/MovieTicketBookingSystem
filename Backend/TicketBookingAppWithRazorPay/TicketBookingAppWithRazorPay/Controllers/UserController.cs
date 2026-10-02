using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBookingAppWithRazorPay.Data;
using TicketBookingAppWithRazorPay.Models;

namespace TicketBookingAppWithRazorPay.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        return Ok(_context.Users.Find(id));
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] string fullName, [FromForm] string email, IFormFile? profileImage)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            user.FullName = fullName;
            user.Email = email;

            if (profileImage != null)
            {
                var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(profileImage.FileName);
                var filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileImage.CopyToAsync(stream);
                }
                user.ProfilePicture = "/images/" + fileName;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var u = _context.Users.Find(id);
        _context.Users.Remove(u);
        await _context.SaveChangesAsync();
        return Ok();
    }
}