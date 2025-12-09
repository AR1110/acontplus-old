namespace Accounting.Api.Endpoints.CuotaPorCobrar;

public static class UpdateCuotaPorCobrarEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapPut("/{id:int}", HandleAsync)
           .WithName("UpdateCuotaPorCobrar")
           .WithSummary("Update an existing cuota por cobrar");
    }

    private static async Task<IResult> HandleAsync(
       ICuotaPorCobrarRepository cuotaPorCobrarRepository,
       IUserContext userContext,
       int id,
       CuotaPorCobrarUpdateParamsDto cobrarUpdateParamsDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeObjectCustom<CuotaPorCobrarUpdateParamsDto>(cobrarUpdateParamsDto) }
        };
        return Results.Ok(await cuotaPorCobrarRepository.UpdateAsync(parameters));
    }
}
