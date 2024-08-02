using System.Security.Claims;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;


namespace Restaurant.API.Controllers
{
    public class RecipeController : BaseApiController
    {
        private readonly IRecipe _recipe;
        private ICustomLogger _log;

        public RecipeController(IRecipe recipe, ICustomLogger log)
        {
            _recipe = recipe;
            _log = log;
        }
        [HttpGet]
        public async Task<ActionResult<ApiResponseDeprecated>> Get()
        {
            var _response = new ApiResponseDeprecated();
            try
            {
                _response.payload = await _recipe.GetAsync();
                _response.code = "0";
                return _response;
            }
            catch (Exception)
            {
                _response.Create(code: "-1", message: "Error on Get");
                return _response;
            }

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _recipe.GetByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetByItem/{id}")]
        public async Task<IActionResult> GetByItem(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId()},
                    { "id", id }
                };

                var result = await _recipe.GetByItem(parameters);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en catch " + ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Recipe recipe)
        {
            try
            {
                var result = await _recipe.CreateAsync(recipe);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpPut]
        public IActionResult Put([FromBody] Recipe recipe)
        {
            try
            {
                var result = _recipe.UpdateAsync(recipe);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var recipe = await _recipe.GetByIdAsync(id);
                _recipe.RemoveAsync(recipe);
                var response = "";
                if (await _recipe.GetByIdAsync(id) == null)
                {
                    response = "Yes Deleted";
                }
                else
                {
                    response = "Cant Deleted";

                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
