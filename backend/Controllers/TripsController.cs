using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTogether.API.Data;
using TravelTogether.API.DTOs;
using TravelTogether.API.Models;

namespace TravelTogether.API.Controllers;

[ApiController, Route("api/trips"), Authorize]
public class TripsController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetTrips([FromQuery] string? destination, [FromQuery] DateTime? date)
    {
        var q = db.Trips.Include(t => t.Owner).Where(t => t.Status == "Open");
        if (!string.IsNullOrEmpty(destination))
            q = q.Where(t => t.Destination.Contains(destination));
        if (date.HasValue)
            q = q.Where(t => t.StartDate.Date == date.Value.Date);

        var trips = await q.OrderByDescending(t => t.CreatedAt).Select(t => MapTrip(t)).ToListAsync();
        return Ok(trips);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrip(int id)
    {
        var t = await db.Trips.Include(t => t.Owner).FirstOrDefaultAsync(t => t.Id == id);
        return t is null ? NotFound() : Ok(MapTrip(t));
    }

    [HttpPost]
    public async Task<IActionResult> CreateTrip(TripCreateDto dto)
    {
        var trip = new Trip
        {
            OwnerId = UserId,
            Origin = dto.Origin,
            Destination = dto.Destination,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            TravelMode = dto.TravelMode,
            MaxCompanions = dto.MaxCompanions,
            Description = dto.Description
        };
        db.Trips.Add(trip);
        await db.SaveChangesAsync();
        await db.Entry(trip).Reference(t => t.Owner).LoadAsync();
        return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, MapTrip(trip));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrip(int id)
    {
        var trip = await db.Trips.FindAsync(id);
        if (trip is null || trip.OwnerId != UserId) return Forbid();
        db.Trips.Remove(trip);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static TripDto MapTrip(Trip t) => new(
        t.Id, t.OwnerId, t.Owner.Name, t.Owner.Photo, t.Owner.Rating,
        t.Origin, t.Destination, t.StartDate, t.EndDate,
        t.TravelMode, t.MaxCompanions, t.Description, t.Status, t.CreatedAt
    );
}
