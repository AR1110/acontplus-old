namespace Restaurant.Api.Endpoints.OrderDetail;

public static class GetEndpoints
{
    public static void MapGetOrderDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/orderdetails/{id:int}", GetOrderDetailById)
            .WithName("GetOrderDetailById")
            .WithTags("OrderDetails")
            .WithOpenApi();

        app.MapGet("/api/orderdetails/order/{orderId:int}", GetOrderDetailsByOrderId)
            .WithName("GetOrderDetailsByOrderId")
            .WithTags("OrderDetails")
            .WithOpenApi();

        app.MapGet("/api/orderdetails/status/{status:int}", GetOrderDetailsByStatus)
            .WithName("GetOrderDetailsByStatus")
            .WithTags("OrderDetails")
            .WithOpenApi();
    }

    private static async Task<IResult> GetOrderDetailById(
        int id,
        IOrderDetailService service)
    {
        try
        {
            var result = await service.GetByIdAsync(id);
            return Results.Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return Results.NotFound();
        }
    }

    private static async Task<IResult> GetOrderDetailsByOrderId(
        int orderId,
        IOrderDetailService service)
    {
        var result = await service.GetByOrderIdAsync(orderId);
        return Results.Ok(result);
    }

    private static async Task<IResult> GetOrderDetailsByStatus(
        int status,
        IOrderDetailService service)
    {
        var result = await service.GetByStatusAsync(status);
        return Results.Ok(result);
    }
}
