using Common.API.Dtos;
using Common.API.Endpoints.Interfaces;

namespace Common.API.Endpoints.Implementations;

public class CommonEndpoints(IDashboardService dashboardService,
    IEmailQueueService emailQueueService,
    IHttpContextAccessor httpContextAccessor,
    INotificationService notificationService,
    IReleaseService releaseService,
    IUserContext userContext,
    IUserManualService userManualService,
    IUserReleaseReadService userReleaseReadService,
    IWhatsappMessageService whatsappMessageService) : ICommonEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public async Task<IResult> CreateEmailQueueAsync(ApiRequest apiRequest)
    {
        apiRequest.UserRoleId = userContext.GetClaimValue<int>(UserRoleClaimType);
        return Results.Ok(await emailQueueService.SendAsync(apiRequest));
    }

    public async Task<IResult> CreateNotificationAsync(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json) },
            { "fromMobile", httpContextAccessor.HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        return Results.Ok(await notificationService.AddAsync(parameters));
    }

    public async Task<IResult> CreateUserReleaseReadAsync(ApiRequest apiRequest)
    {
        apiRequest.UserRoleId = userContext.GetClaimValue<int>(UserRoleClaimType);
        return Results.Ok(await userReleaseReadService.AddAsync(apiRequest));
    }

    public async Task<IResult> CreateWhatsappMessageAsync(WhatsappMessageDto whatsappMessageDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<WhatsappMessageDto>(whatsappMessageDto) },
            { "fromMobile", httpContextAccessor.HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        return Results.Ok(await whatsappMessageService.AddAsync(parameters));
    }

    public async Task<IResult> GetDashboardAsync(string json)
    {
        var response = await dashboardService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json ?? "") }
        });

        return Results.Ok(response);
    }

    public async Task<IResult> GetReleaseAsync()
    {
        return Results.Ok(await releaseService.GetAsync(userContext.GetClaimValue<int>(UserRoleClaimType)));
    }

    public async Task<IResult> GetUserManualAsync(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await userManualService.GetAsync(parameters));
    }
}
