using Purchases.Application.Dtos.Orders;

namespace Purchases.Api.Endpoints.Order;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-orders")
            .RequireAuthorization()
            .WithDescription("Endpoints for creating purchase orders.")
            .WithTags("Purchase Orders");

        group.MapPost("/", async (
            OrderCreate request,
            IOrderService OrderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUserRole = request with { UserRoleId = userRoleId };

            return await OrderService
          .AddAsync(requestWithUserRole, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreatePurchaseOrder")
            .WithSummary("Create a new purchase order")
            .WithDescription("Create a new purchase order record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
