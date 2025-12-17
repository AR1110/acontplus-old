namespace Purchases.Api.Endpoints.Supplier;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suppliers")
            .RequireAuthorization()
            .WithDescription("Endpoints for creating suppliers.")
            .WithTags("Suppliers");

        group.MapPost("/", async (
            ProveedorDto proveedorDto,
            IProveedorRepository proveedorRepository,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<ProveedorDto>(proveedorDto)) }
            };
            return Results.Ok(await proveedorRepository.AddAsync(parameters));
        })
            .WithName("CreateSupplier")
            .WithSummary("Create a new supplier")
            .WithDescription("Create a new supplier record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
