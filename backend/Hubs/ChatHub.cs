using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TravelTogether.API.Controllers;
using TravelTogether.API.Data;
using TravelTogether.API.Models;

namespace TravelTogether.API.Hubs;

[Authorize]
public class ChatHub(AppDbContext db) : Hub
{
    public async Task JoinRoom(int partnerId)
    {
        var userId = int.Parse(Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var room = MessagesController.GetRoom(userId, partnerId);
        await Groups.AddToGroupAsync(Context.ConnectionId, room);
    }

    public async Task SendMessage(int receiverId, string text)
    {
        var userId = int.Parse(Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var room = MessagesController.GetRoom(userId, receiverId);

        var message = new Message { SenderId = userId, ReceiverId = receiverId, Room = room, Text = text };
        db.Messages.Add(message);
        await db.SaveChangesAsync();

        await db.Entry(message).Reference(m => m.Sender).LoadAsync();
        await Clients.Group(room).SendAsync("ReceiveMessage", new
        {
            message.Id, message.SenderId,
            SenderName = message.Sender.Name,
            message.Text, message.CreatedAt
        });
    }
}
