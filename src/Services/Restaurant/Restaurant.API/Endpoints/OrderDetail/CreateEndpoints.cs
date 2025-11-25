using Restaurant.Application.Dtos.Order;

namespace Restaurant.Api.Endpoints.OrderDetail;

public static class CreateEndpoints
{
    public static void MapCreateOrderDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/orderdetails", CreateOrderDetail)
            .WithName("CreateOrderDetail")
            .WithTags("OrderDetails")
            .WithOpenApi();
    }

    private static async Task<IResult> CreateOrderDetail(
        OrderDetailCreate request,
        IOrderDetailService service)
    {
        try
        {
            var result = await service.CreateAsync(request);
            return Results.Created($"/api/orderdetails/{result.Id}", result);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
}
