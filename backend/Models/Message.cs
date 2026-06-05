namespace TravelTogether.API.Models;

public class Message
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;
    public int ReceiverId { get; set; }
    public User Receiver { get; set; } = null!;
    public string Room { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public bool IsGroupRoom { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
