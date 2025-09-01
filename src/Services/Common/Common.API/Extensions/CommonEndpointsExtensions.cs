using Common.API.Endpoints.Interfaces;

namespace Common.API.Extensions;

public static class CommonEndpointsExtensions
{
    public static IEndpointRouteBuilder MapCommonEndpoints(this IEndpointRouteBuilder builder)
    {
        builder.MapGet("/dashboard", async (ICommonEndpoints commonEndpoints, string json) =>
                await commonEndpoints.GetDashboardAsync(json))
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Dashboard");

        builder.MapPost("/emailqueue", async (ICommonEndpoints commonEndpoints, ApiRequest apiRequest) =>
                await commonEndpoints.CreateEmailQueueAsync(apiRequest))
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Email Queue");

        builder.MapPost("/notificacion", async (ICommonEndpoints commonEndpoints, string json) =>
                await commonEndpoints.CreateNotificationAsync(json))
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Notificacion");

        builder.MapGet("/release", async (ICommonEndpoints commonEndpoints) =>
                await commonEndpoints.GetReleaseAsync())
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Release");

        builder.MapGet("/usermanual", async (ICommonEndpoints commonEndpoints, string json) =>
                await commonEndpoints.GetUserManualAsync(json))
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("User Manual");

        builder.MapPost("/userrelease", async (ICommonEndpoints commonEndpoints, ApiRequest apiRequest) =>
                await commonEndpoints.CreateUserReleaseReadAsync(apiRequest))
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("User Release");

        builder.MapPost("/whatsappmessage",
                async (ICommonEndpoints commonEndpoints, WhatsappMessageDto whatsappMessageDto) =>
                    await commonEndpoints.CreateWhatsappMessageAsync(whatsappMessageDto))
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("WhatsApp Message");

        return builder;
    }
}
