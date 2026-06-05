namespace TravelTogether.API.Models;

public class Trip
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string TravelMode { get; set; } = "Flight";
    public int MaxCompanions { get; set; } = 3;
    public string? Description { get; set; }
    public string Status { get; set; } = "Open";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Match> Matches { get; set; } = [];
}
