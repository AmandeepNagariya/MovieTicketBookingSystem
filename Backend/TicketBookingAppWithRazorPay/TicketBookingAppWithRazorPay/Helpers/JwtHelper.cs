using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TicketBookingAppWithRazorPay.Models;

public static class JwtHelper
{
    public static string GenerateToken(User user)
    {
        // 🔥 HARDCODED KEY
        var key = "THIS_IS_A_VERY_LONG_SUPER_SECRET_KEY_32_CHARS_MIN";

        var claims = new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim("name", user.FullName),
            new Claim("email", user.Email),
            new Claim("role", user.Role)
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key)
        );

        var creds = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: "TicketBooking",      
            audience: "TicketBooking",    
            claims: claims,
            expires: DateTime.Now.AddHours(5),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}