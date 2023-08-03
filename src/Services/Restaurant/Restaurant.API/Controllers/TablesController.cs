using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly RestaurantContext _context;
        private readonly IAppTableService _tableService;

        public TablesController(RestaurantContext context, IAppTableService tableService)
        {
            _context = context;
            _tableService = tableService;
        }

        // GET: api/Tables
        [HttpGet]
        public async Task<IActionResult> GetTable(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", json}
                };
                var response = await _tableService.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTable(int id, [FromBody] ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _tableService.UpdateAsync(id, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/Tables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostTable([FromBody] ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _tableService.AddAsync(request);
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Tables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id, [FromBody] ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _tableService.DeleteAsync(id, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
