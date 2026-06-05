namespace TravelTogether.API.DTOs;

public record RegisterDto(string Name, string Email, string Password, string TravelStyle, string? Languages, string? Bio);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, int Id, string Name, string Email, string? Photo, bool IsPremium, bool IsVerified);
public record UpdateProfileDto(string? Name, string? Bio, string? TravelStyle, string? Languages, string? EmergencyContact);

public record TripCreateDto(string Origin, string Destination, DateTime StartDate, DateTime EndDate, string TravelMode, int MaxCompanions, string? Description);
public record TripDto(int Id, int OwnerId, string OwnerName, string? OwnerPhoto, double OwnerRating, string Origin, string Destination, DateTime StartDate, DateTime EndDate, string TravelMode, int MaxCompanions, string? Description, string Status, DateTime CreatedAt);

public record MatchCreateDto(int TripId);
public record MatchActionDto(string Action); // "accept" or "decline"
public record MatchDto(int Id, int TripId, string Destination, int RequesterId, string RequesterName, string? RequesterPhoto, string Status, DateTime CreatedAt);

public record ReviewCreateDto(int RevieweeId, int TripId, int Rating, string? Comment);
public record ReviewDto(int Id, string ReviewerName, string? ReviewerPhoto, int Rating, string? Comment, DateTime CreatedAt);

public record MessageDto(int Id, int SenderId, string SenderName, string Text, DateTime CreatedAt);
public record CheckInDto(string Message);
