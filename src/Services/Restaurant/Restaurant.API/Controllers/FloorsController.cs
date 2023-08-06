using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FloorsController : ControllerBase
    {
        private readonly RestaurantContext _context;
        private readonly IAppFloorService _floorService;

        public FloorsController(RestaurantContext context, IAppFloorService floorService)
        {
            _context = context;
            _floorService = floorService;
        }

        // GET: api/Floors
        [HttpGet]
        public async Task<ActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", json }
                };

                var response = await _floorService.GetAsync(parameters);
                if (response == null) { return NoContent(); }

                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        // POST: api/Floors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> Post(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _floorService.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _floorService.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Floors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = new ApiRequest();
            request.UserRoleId = User.GetUserRoleId();

            try
            {
                var response = await _floorService.DeleteAsync(id, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private bool FloorExists(int id)
        {
            return _context.Floors.Any(e => e.Id == id);
        }
    }
}
