using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTogether.API.Data;
using TravelTogether.API.DTOs;

namespace TravelTogether.API.Controllers;

[ApiController, Route("api/users"), Authorize]
public class UsersController(AppDbContext db, IWebHostEnvironment env) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var user = await db.Users.FindAsync(UserId);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
    {
        var user = await db.Users.FindAsync(UserId);
        if (user is null) return NotFound();
        if (dto.Name is not null) user.Name = dto.Name;
        if (dto.Bio is not null) user.Bio = dto.Bio;
        if (dto.TravelStyle is not null) user.TravelStyle = dto.TravelStyle;
        if (dto.Languages is not null) user.Languages = dto.Languages;
        if (dto.EmergencyContact is not null) user.EmergencyContact = dto.EmergencyContact;
        await db.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPost("me/photo")]
    public async Task<IActionResult> UploadPhoto(IFormFile file)
    {
        if (file.Length > 5_000_000) return BadRequest("Max 5MB.");
        var uploads = Path.Combine(env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploads);
        var fileName = $"{UserId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var path = Path.Combine(uploads, fileName);
        await using var stream = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(stream);
        var user = await db.Users.FindAsync(UserId);
        user!.Photo = $"/uploads/{fileName}";
        await db.SaveChangesAsync();
        return Ok(new { photo = user.Photo });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await db.Users.Select(u => new {
            u.Id, u.Name, u.Photo, u.TravelStyle, u.Languages, u.Bio,
            u.Rating, u.ReviewCount, u.IsVerified, u.IsPremium
        }).FirstOrDefaultAsync(u => u.Id == id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpGet("{id}/reviews")]
    public async Task<IActionResult> GetReviews(int id)
    {
        var reviews = await db.Reviews
            .Where(r => r.RevieweeId == id)
            .Include(r => r.Reviewer)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(r.Id, r.Reviewer.Name, r.Reviewer.Photo, r.Rating, r.Comment, r.CreatedAt))
            .ToListAsync();
        return Ok(reviews);
    }

    [HttpPost("checkin")]
    public async Task<IActionResult> SafetyCheckIn(CheckInDto dto)
    {
        var user = await db.Users.FindAsync(UserId);
        // In production: send SMS/email to emergency contact
        // For now: log and return success
        return Ok(new { message = $"Check-in sent to {user!.EmergencyContact}: {dto.Message}" });
    }
}
