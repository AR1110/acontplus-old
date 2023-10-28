using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{
    public class IngredientController : BaseApiController
    {
        private readonly IIngredientService _ingredient;
        private readonly LogWriter _log;
        public IngredientController(IIngredientService ingredient, LogWriter log)
        {
            _ingredient = ingredient;
            _log = log;
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
                if (response == null)
                {
                    _log.LogActivity("No se pudo obtener la data");
                    return NoContent();
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en el catch \n" + ex.Message);
                return BadRequest("Error on getting ingredients, testing hot reload: " + ex.Message);
            }
        }
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var response = await _ingredient.GetByIdAsync(id);
                if (response == null)
                {
                    return NoContent();
                };
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error on getting ingredients, testing hot reload: " + ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _ingredient.AddAsync(data);
                if (response == null | string.IsNullOrEmpty(response))
                {
                    _log.LogActivity($"Can't save, error");
                    return BadRequest("Cant Save");
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error catch on post \n" + ex.Message);
                return BadRequest("Error on Post: " + ex.Message);
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _ingredient.UpdateAsync(id, data);
                if (response == null | string.IsNullOrEmpty(response))
                {
                    _log.LogActivity("Can't update");
                    return BadRequest("Cant Update");
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error catch \n {ex.Message}");
                return BadRequest("Error on Post: " + ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _ingredient.DeleteAsync(id);
                if (!response) { return BadRequest("Cant Delete"); };
                return Ok(response);
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error on delete:" + ex.Message);
            }
        }
    }
}
