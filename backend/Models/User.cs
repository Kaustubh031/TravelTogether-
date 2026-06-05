namespace TravelTogether.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Photo { get; set; }
    public string TravelStyle { get; set; } = "Budget";
    public string? Languages { get; set; }
    public string? Bio { get; set; }
    public string? EmergencyContact { get; set; }
    public bool IsVerified { get; set; } = false;
    public bool IsPremium { get; set; } = false;
    public double Rating { get; set; } = 0;
    public int ReviewCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Trip> Trips { get; set; } = [];
    public ICollection<Match> SentMatches { get; set; } = [];
    public ICollection<Match> ReceivedMatches { get; set; } = [];
    public ICollection<Review> ReviewsGiven { get; set; } = [];
    public ICollection<Review> ReviewsReceived { get; set; } = [];
}
