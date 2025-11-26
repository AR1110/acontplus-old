namespace Restaurant.Api.Endpoints.OrderDetail;

public static class RegisterOrderDetailEndpoints
{
    public static void AddOrderDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateOrderDetailEndpoints();
        app.MapGetOrderDetailEndpoints();
        app.MapUpdateOrderDetailEndpoints();
        app.MapDeleteOrderDetailEndpoints();
    }
}
