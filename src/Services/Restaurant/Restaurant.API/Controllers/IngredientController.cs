using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    public class IngredientController : BaseApiController
    {
        private readonly IIngredientService _ingredient;
        public IngredientController(IIngredientService ingredient)
        {
            _ingredient = ingredient;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", json}
                };
                var response = await _ingredient.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (System.Exception)
            {
                return BadRequest("Error on getting ingredients");
                throw;
            }
        }
    }
}