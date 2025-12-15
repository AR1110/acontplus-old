using Acontplus.Utilities.Data;
using Microsoft.AspNetCore.Mvc;

namespace Common.Api.Endpoints;

public static class RegisterEndpoints
{
    private const string UserRoleIdClaim = "userRoleId";

    public static IEndpointRouteBuilder MapCommonEndpoints(this IEndpointRouteBuilder builder)
    {
        builder.MapLookupEndpoints();

        builder.MapGet("/dashboard", async (
                IDashboardService dashboardService,
                IUserContext userContext,
                ILogger<IDashboardService> logger) =>
            {
                try
                {
                    var response = await dashboardService.GetAsync(new Dictionary<string, object>
                    {
                        { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                        { "json", "{}" }
                    });
                    return Results.Ok(response);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error retrieving dashboard data");
                    return Results.Problem("An error occurred while retrieving dashboard data", statusCode: 500);
                }
            })
            .RequireAuthorization()

            .WithTags("Dashboard")
            .Produces<SpResponse>(200)
            .Produces(401)
            .Produces(500);

        builder.MapPost("/notificacion", async (
                INotificationService notificationService,
                IUserContext userContext,
                IHttpContextAccessor httpContextAccessor,
                ILogger<INotificationService> logger,
                [FromBody] CreateNotificationDto createNotificationDto) =>
            {
                try
                {
                    if (createNotificationDto == null)
                        return Results.BadRequest(new { error = "CreateNotificationDto cannot be null" });

                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", UserRoleIdClaim },
                        { "json", DataConverters.SerializeObjectCustom<CreateNotificationDto>(createNotificationDto) },
                        { "fromMobile", httpContextAccessor.HttpContext?.Items["FromMobile"] as bool? ?? false }
                    };
                    var result = await notificationService.AddAsync(parameters);
                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error creating notification");
                    return Results.Problem("An error occurred while creating notification", statusCode: 500);
                }
            })
            .RequireAuthorization()

            .WithTags("Notificacion")
            .Produces<SpResponse>(200)
            .Produces(400)
            .Produces(401)
            .Produces(500);

        builder.MapGet("/release", async (
                IReleaseService releaseService,
                IUserContext userContext,
                ILogger<IReleaseService> logger) =>
            {
                try
                {
                    var result = await releaseService.GetAsync(userContext.GetClaimValue<int>(UserRoleIdClaim));
                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error retrieving release information");
                    return Results.Problem("An error occurred while retrieving release information", statusCode: 500);
                }
            })
            .RequireAuthorization()

            .WithTags("Release")
            .Produces<SpResponse>(200)
            .Produces(401)
            .Produces(500);

        builder.MapGet("/usermanual", async (
                IUserManualService userManualService,
                IUserContext userContext,
                ILogger<IUserManualService> logger,
                int? menuId = null,
                string? textSearch = null,
                int pageIndex = 1,
                int pageSize = 10) =>
            {
                try
                {
                    var getUserManualDto = new GetUserManualDto
                    {
                        MenuId = menuId ?? 0,
                        TextSearch = textSearch ?? string.Empty,
                        PageIndex = pageIndex,
                        PageSize = pageSize
                    };

                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", userContext.GetClaimValue<int>(UserRoleIdClaim) },
                        { "json", DataConverters.SerializeObjectCustom<GetUserManualDto>(getUserManualDto) }
                    };
                    var result = await userManualService.GetAsync(parameters);
                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error retrieving user manual");
                    return Results.Problem("An error occurred while retrieving user manual", statusCode: 500);
                }
            })
            .RequireAuthorization()

            .WithTags("User Manual")
            .Produces<SpResponse>(200)
            .Produces(401)
            .Produces(500);

        builder.MapPost("/userrelease", async (
                IUserReleaseReadService userReleaseReadService,
                IUserContext userContext,
                ILogger<IUserReleaseReadService> logger,
                [FromBody] CreateUserReleaseReadDto createUserReleaseReadDto) =>
            {
                try
                {
                    if (createUserReleaseReadDto == null)
                        return Results.BadRequest(new { error = "CreateUserReleaseReadDto cannot be null" });

                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", userContext.GetClaimValue<int>(UserRoleIdClaim) },
                        {
                            "json",
                            DataConverters.SerializeObjectCustom<CreateUserReleaseReadDto>(createUserReleaseReadDto)
                        }
                    };
                    var result = await userReleaseReadService.AddAsync(parameters);
                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error marking release as read");
                    return Results.Problem("An error occurred while marking release as read", statusCode: 500);
                }
            })
            .RequireAuthorization()

            .WithTags("User Release")
            .Produces<SpResponse>(200)
            .Produces(400)
            .Produces(401)
            .Produces(500);

        builder.MapPost("/whatsappmessage", async (
                IWhatsappMessageService whatsappMessageService,
                IUserContext userContext,
                IHttpContextAccessor httpContextAccessor,
                ILogger<IWhatsappMessageService> logger,
                [FromBody] CreateWhatsAppMessageDto createWhatsAppMessageDto) =>
            {
                try
                {
                    if (createWhatsAppMessageDto == null)
                        return Results.BadRequest(new { error = "CreateWhatsAppMessageDto cannot be null" });

                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", userContext.GetClaimValue<int>(UserRoleIdClaim) },
                        {
                            "json",
                            DataConverters.SerializeObjectCustom<CreateWhatsAppMessageDto>(createWhatsAppMessageDto)
                        },
                        { "fromMobile", httpContextAccessor.HttpContext?.Items["FromMobile"] as bool? ?? false }
                    };
                    var result = await whatsappMessageService.AddAsync(parameters);
                    return Results.Ok(result);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error sending WhatsApp message");
                    return Results.Problem("An error occurred while sending WhatsApp message", statusCode: 500);
                }
            })
            .RequireAuthorization()

            .WithTags("WhatsApp Message")
            .Produces<SpResponse>(200)
            .Produces(400)
            .Produces(401)
            .Produces(500);

        return builder;
    }
}
