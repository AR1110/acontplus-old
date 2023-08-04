using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
    public class ProductionAreasController : ControllerBase
    {
        private readonly RestaurantContext _context;
        private readonly IAppProductionAreaService _service;

        public ProductionAreasController(RestaurantContext context, IAppProductionAreaService service)
        {
            _context = context;
            _service = service;
        }

        // GET: api/ProductionAreas
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },                    
                };

                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); }

                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
           
    }
}
