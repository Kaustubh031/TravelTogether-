using Microsoft.EntityFrameworkCore;
using TravelTogether.API.Models;

namespace TravelTogether.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Match>()
            .HasOne(m => m.Requester).WithMany(u => u.SentMatches).HasForeignKey(m => m.RequesterId).OnDelete(DeleteBehavior.Restrict);
        mb.Entity<Match>()
            .HasOne(m => m.Owner).WithMany(u => u.ReceivedMatches).HasForeignKey(m => m.OwnerId).OnDelete(DeleteBehavior.Restrict);
        mb.Entity<Match>()
            .HasOne(m => m.Trip).WithMany(t => t.Matches).HasForeignKey(m => m.TripId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Message>()
            .HasOne(m => m.Sender).WithMany().HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Restrict);
        mb.Entity<Message>()
            .HasOne(m => m.Receiver).WithMany().HasForeignKey(m => m.ReceiverId).OnDelete(DeleteBehavior.Restrict);

        mb.Entity<Review>()
            .HasOne(r => r.Reviewer).WithMany(u => u.ReviewsGiven).HasForeignKey(r => r.ReviewerId).OnDelete(DeleteBehavior.Restrict);
        mb.Entity<Review>()
            .HasOne(r => r.Reviewee).WithMany(u => u.ReviewsReceived).HasForeignKey(r => r.RevieweeId).OnDelete(DeleteBehavior.Restrict);
        mb.Entity<Review>()
            .HasOne(r => r.Trip).WithMany().HasForeignKey(r => r.TripId).OnDelete(DeleteBehavior.Cascade);
        mb.Entity<Review>()
            .HasIndex(r => new { r.ReviewerId, r.RevieweeId, r.TripId }).IsUnique();

        mb.Entity<Trip>()
            .HasOne(t => t.Owner).WithMany(u => u.Trips).HasForeignKey(t => t.OwnerId).OnDelete(DeleteBehavior.Cascade);
    }
}
