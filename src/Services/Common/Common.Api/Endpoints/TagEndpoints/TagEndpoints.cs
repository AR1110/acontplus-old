namespace Common.Api.Endpoints.TagEndpoints;

public static class TagEndpoints
{
    public static void MapTagEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tags")
            .RequireAuthorization()
            .WithTags("Tags");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (ITagService tagService, CancellationToken cancellationToken) =>
                {
                    return await tagService.GetAsync().ToGetMinimalApiResultAsync();
                })
            .WithName("GetTags")
            .WithSummary("Get all tags")
            .WithDescription("Retrieves all tags")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (TagCreate request, ITagService tagService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await tagService.AddAsync(request, userContext.GetUserId(), cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateTag")
            .WithSummary("Create a tag")
            .WithDescription("Creates a new tag")
            .Produces<TagItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, TagUpdate request, ITagService tagService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await tagService.UpdateAsync(id, request, userContext.GetUserId(), cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateTag")
            .WithSummary("Update a tag")
            .WithDescription("Updates an existing tag")
            .Produces<TagItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, ITagService tagService) =>
                {
                    return await tagService.DeleteAsync(id).ToMinimalApiResultAsync();
                })
            .WithName("DeleteTag")
            .WithSummary("Delete a tag")
            .WithDescription("Deletes a tag by ID")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
