using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelTogether.API.Data;

namespace TravelTogether.API.Controllers;

[ApiController, Route("api/messages"), Authorize]
public class MessagesController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{partnerId}")]
    public async Task<IActionResult> GetHistory(int partnerId)
    {
        var room = GetRoom(UserId, partnerId);
        var msgs = await db.Messages.Where(m => m.Room == room)
            .Include(m => m.Sender)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new { m.Id, m.SenderId, SenderName = m.Sender.Name, m.Text, m.CreatedAt })
            .ToListAsync();
        return Ok(msgs);
    }

    public static string GetRoom(int a, int b) => a < b ? $"{a}_{b}" : $"{b}_{a}";
}
