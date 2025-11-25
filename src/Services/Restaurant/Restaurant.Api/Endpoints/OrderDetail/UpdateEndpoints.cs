using Restaurant.Application.Dtos.Order;

namespace Restaurant.Api.Endpoints.OrderDetail;

public static class UpdateEndpoints
{
    public static void MapUpdateOrderDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPut("/api/orderdetails/{id:int}", UpdateOrderDetail)
            .WithName("UpdateOrderDetail")
            .WithTags("OrderDetails")
            .WithOpenApi();

        app.MapPatch("/api/orderdetails/{id:int}/status/{status:int}", UpdateOrderDetailStatus)
            .WithName("UpdateOrderDetailStatus")
            .WithTags("OrderDetails")
            .WithOpenApi();
    }

    private static async Task<IResult> UpdateOrderDetail(
        int id,
        OrderDetailUpdate request,
        IOrderDetailService service)
    {
        try
        {
            var result = await service.UpdateAsync(id, request);
            return Results.Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return Results.NotFound();
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    private static async Task<IResult> UpdateOrderDetailStatus(
        int id,
        int status,
        IOrderDetailService service)
    {
        try
        {
            var result = await service.UpdateStatusAsync(id, status);
            return Results.Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return Results.NotFound();
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
}
