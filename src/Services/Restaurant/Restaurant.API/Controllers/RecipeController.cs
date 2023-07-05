using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Common;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;

namespace Restaurant.API.Controllers
{
    public class RecipeController : BaseApiController
    {
        private readonly IRecipe _recipe;
        public RecipeController(IRecipe recipe)
        {
            _recipe = recipe;
        }
        [HttpGet]
        public async Task<ActionResult<StructureResponse>> Get()
        {
            var _response = new StructureResponse();
            try
            {
                _response.payload = await _recipe.GetAsync();
                _response.code = "0";
                return _response;
            }
            catch (Exception ex)
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
                var userId = HttpContext.User.FindFirstValue("userId");
                Console.WriteLine(userId);
                var result = await _recipe.GetByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
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
