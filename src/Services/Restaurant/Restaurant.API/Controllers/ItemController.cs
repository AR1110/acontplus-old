using Acontplus.Core.Enums;
using Acontplus.Core.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Restaurant.API.Controllers;

public class ItemController(IItemService itemService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(PaginationQuery paginationQuery)
    {
        var userRoleId = User.GetClaimValue<int>("userRoleId");

        var pagination = new PaginationDto
        {
            PageIndex = paginationQuery.PageIndex,
            PageSize = paginationQuery.PageSize,
            SortBy = paginationQuery.SortBy,
            SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc,
            SearchTerm = paginationQuery.SearchTerm,
            Filters = paginationQuery.Filters
        };

        if (userRoleId != 0)
        {
            pagination = pagination.WithFilter("userRoleId", userRoleId);
        }

        return Ok(await itemService.GetAsync(pagination));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var parameters = new Dictionary<string, object>
        {
             { "UserRoleId", User.GetClaimValue<int>("userRoleId") },
            { "Id", id }
        };
        return Ok(await itemService.GetByIdAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateItemDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "UserRoleId", User.GetClaimValue<int>("userRoleId") },
            { "Id", id },
            { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateItemDto>(data)) }
        };
        return Ok(await itemService.UpdateAsync(parameters));
    }
}
