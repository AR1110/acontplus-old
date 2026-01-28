namespace Configuration.Api.Endpoints.SubscriptionTypeEndpoints;

public static class SubscriptionTypeEndpoints
{
    public static void MapSubscriptionTypeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/subscription-types")
            .RequireAuthorization()
            .WithTags("Subscription Types");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (ISubscriptionTypeService subscriptionTypeService, CancellationToken cancellationToken) =>
                {
                    return await subscriptionTypeService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllSubscriptionTypes")
            .WithSummary("Get all subscription types")
            .WithDescription("Retrieves a list of all SubscriptionType resources.")
            .Produces<IReadOnlyList<SubscriptionTypeItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, ISubscriptionTypeService subscriptionTypeService, CancellationToken cancellationToken) =>
                {
                    return await subscriptionTypeService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetSubscriptionTypeById")
            .WithSummary("Get a subscription type by ID")
            .WithDescription("Retrieves a single SubscriptionType resource by its unique identifier.")
            .Produces<SubscriptionTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (SubscriptionTypeCreate request, ISubscriptionTypeService subscriptionTypeService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    var subscriptionType = new SubscriptionType
                    {
                        Id = 0, // Will be set by the database
                        Code = request.Code,
                        Name = request.Name,
                        Quantity = request.Quantity,
                        Duration = request.Duration,
                        CreatedByUserId = userContext.GetUserId(),
                        IsActive = true
                    };

                    return await subscriptionTypeService.AddAsync(subscriptionType, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("CreateSubscriptionType")
            .WithSummary("Create a new subscription type")
            .WithDescription("Creates a new SubscriptionType resource.")
            .Produces<SubscriptionTypeItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, SubscriptionTypeUpdate request, ISubscriptionTypeService subscriptionTypeService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    var subscriptionType = new SubscriptionType
                    {
                        Id = id,
                        Code = request.Code,
                        Name = request.Name,
                        Quantity = request.Quantity,
                        Duration = request.Duration,
                        UpdatedByUserId = userContext.GetUserId()
                    };

                    return await subscriptionTypeService.UpdateAsync(id, subscriptionType, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateSubscriptionType")
            .WithSummary("Update an existing subscription type")
            .WithDescription("Updates an existing SubscriptionType resource by its unique identifier.")
            .Produces<SubscriptionTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, ISubscriptionTypeService subscriptionTypeService, CancellationToken cancellationToken) =>
                {
                    return await subscriptionTypeService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteSubscriptionType")
            .WithSummary("Delete a subscription type")
            .WithDescription("Deletes a SubscriptionType resource by its unique identifier.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
