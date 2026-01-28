namespace Common.Api.Endpoints.DashboardEndpoints;

public static class GetEndpoints
{
    //public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    //{
    //    var group = app.MapGroup("/api/dashboard")
    //        .RequireAuthorization()
    //        .WithTags("Dashboard");

    //    group.MapGet("/",
    //            async ([FromQuery] string json, IDashboardService dashboardService) =>
    //            {
    //                var parameters = new Dictionary<string, object>
    //                {
    //                    { "json", SqlStringParam.Sanitize(json) }
    //                };

    //                return await dashboardService.GetAsync(parameters).ToGetMinimalApiResultAsync();
    //            })
    //        .WithName("GetDashboard")
    //        .WithSummary("Get dashboard data")
    //        .WithDescription("Retrieves dashboard data based on json parameter")
    //        .Produces(StatusCodes.Status200OK)
    //        .ProducesProblem(StatusCodes.Status500InternalServerError);
    //}
}
