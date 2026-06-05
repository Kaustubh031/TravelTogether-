namespace TravelTogether.API.Models;

public class Match
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public Trip Trip { get; set; } = null!;
    public int RequesterId { get; set; }
    public User Requester { get; set; } = null!;
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public string Status { get; set; } = "Pending"; // Pending, Accepted, Declined
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
