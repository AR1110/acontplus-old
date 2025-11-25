namespace Restaurant.Api.Endpoints.OrderDetail;

public static class DeleteEndpoints
{
    public static void MapDeleteOrderDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/orderdetails/{id:int}", DeleteOrderDetail)
            .WithName("DeleteOrderDetail")
            .WithTags("OrderDetails")
            .WithOpenApi();
    }

    private static async Task<IResult> DeleteOrderDetail(
        int id,
        IOrderDetailService service)
    {
        try
        {
            var success = await service.DeleteAsync(id);
            return success ? Results.NoContent() : Results.NotFound();
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
}
