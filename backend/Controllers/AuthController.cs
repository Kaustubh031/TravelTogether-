using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTogether.API.Data;
using TravelTogether.API.DTOs;
using TravelTogether.API.Models;
using TravelTogether.API.Services;

namespace TravelTogether.API.Controllers;

[ApiController, Route("api/auth")]
public class AuthController(AppDbContext db, JwtService jwt) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already in use.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            TravelStyle = dto.TravelStyle,
            Languages = dto.Languages,
            Bio = dto.Bio
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return Ok(BuildResponse(user));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");
        return Ok(BuildResponse(user));
    }

    private AuthResponseDto BuildResponse(User u) =>
        new(jwt.GenerateToken(u), u.Id, u.Name, u.Email, u.Photo, u.IsPremium, u.IsVerified);
}
