using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTogether.API.Data;
using TravelTogether.API.DTOs;
using TravelTogether.API.Models;

namespace TravelTogether.API.Controllers;

[ApiController, Route("api/matches"), Authorize]
public class MatchesController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> RequestMatch(MatchCreateDto dto)
    {
        var trip = await db.Trips.FindAsync(dto.TripId);
        if (trip is null) return NotFound();
        if (trip.OwnerId == UserId) return BadRequest("Cannot match your own trip.");
        if (await db.Matches.AnyAsync(m => m.TripId == dto.TripId && m.RequesterId == UserId))
            return BadRequest("Already requested.");

        var match = new Match { TripId = dto.TripId, RequesterId = UserId, OwnerId = trip.OwnerId };
        db.Matches.Add(match);
        await db.SaveChangesAsync();
        return Ok(match);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> RespondMatch(int id, MatchActionDto dto)
    {
        var match = await db.Matches.FindAsync(id);
        if (match is null || match.OwnerId != UserId) return Forbid();
        match.Status = dto.Action.ToLower() == "accept" ? "Accepted" : "Declined";
        await db.SaveChangesAsync();
        return Ok(match);
    }

    [HttpGet("incoming")]
    public async Task<IActionResult> Incoming() =>
        Ok(await db.Matches.Where(m => m.OwnerId == UserId)
            .Include(m => m.Requester).Include(m => m.Trip)
            .Select(m => new MatchDto(m.Id, m.TripId, m.Trip.Destination, m.RequesterId, m.Requester.Name, m.Requester.Photo, m.Status, m.CreatedAt))
            .ToListAsync());

    [HttpGet("my")]
    public async Task<IActionResult> My() =>
        Ok(await db.Matches.Where(m => m.RequesterId == UserId)
            .Include(m => m.Owner).Include(m => m.Trip)
            .Select(m => new MatchDto(m.Id, m.TripId, m.Trip.Destination, m.OwnerId, m.Owner.Name, m.Owner.Photo, m.Status, m.CreatedAt))
            .ToListAsync());
}
