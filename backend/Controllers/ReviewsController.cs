using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTogether.API.Data;
using TravelTogether.API.DTOs;
using TravelTogether.API.Models;

namespace TravelTogether.API.Controllers;

[ApiController, Route("api/reviews"), Authorize]
public class ReviewsController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateReview(ReviewCreateDto dto)
    {
        if (dto.RevieweeId == UserId) return BadRequest("Cannot review yourself.");
        if (await db.Reviews.AnyAsync(r => r.ReviewerId == UserId && r.RevieweeId == dto.RevieweeId && r.TripId == dto.TripId))
            return BadRequest("Already reviewed.");

        var review = new Review
        {
            ReviewerId = UserId, RevieweeId = dto.RevieweeId,
            TripId = dto.TripId, Rating = dto.Rating, Comment = dto.Comment
        };
        db.Reviews.Add(review);
        await db.SaveChangesAsync();

        // update average rating
        var reviewee = await db.Users.FindAsync(dto.RevieweeId);
        var stats = await db.Reviews.Where(r => r.RevieweeId == dto.RevieweeId)
            .GroupBy(_ => 1).Select(g => new { Avg = g.Average(r => r.Rating), Count = g.Count() }).FirstAsync();
        reviewee!.Rating = Math.Round(stats.Avg, 1);
        reviewee.ReviewCount = stats.Count;
        await db.SaveChangesAsync();
        return Ok(review);
    }
}
