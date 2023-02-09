using Microsoft.AspNetCore.SignalR;

namespace WebUI.Hubs
{
    public class NotificationHub: Hub
    {
        public static List<string> _notifications = new List<string>();
        public async Task SendNotification(string notificationName)
        {
            _notifications.Add(notificationName);
            await Clients.All.SendAsync("ReceiveNotification", notificationName, _notifications.Count());
        }

        public async Task ResetNotification()
        {
            _notifications.Clear();
            await Clients.All.SendAsync("ReceiveResetNotification");
        }

    }
}
