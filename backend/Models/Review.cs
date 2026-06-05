namespace TravelTogether.API.Models;

public class Review
{
    public int Id { get; set; }
    public int ReviewerId { get; set; }
    public User Reviewer { get; set; } = null!;
    public int RevieweeId { get; set; }
    public User Reviewee { get; set; } = null!;
    public int TripId { get; set; }
    public Trip Trip { get; set; } = null!;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
