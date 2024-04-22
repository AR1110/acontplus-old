using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Extensions;
using Services.Common.Logs;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class CategoryController : BaseApiController
    {
        private readonly ICategoryService _categoryService;
        private readonly ICustomLogger _log;
        public CategoryController(ICategoryService categoryService, ICustomLogger log)
        {
            _categoryService = categoryService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _categoryService.GetAsync();
                if (response == null) { return BadRequest("Can't Get brand"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get:\n {ex}");
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Category category)
        {
            try
            {
                category.UserId = User.GetUserId();
                var response = await _categoryService.AddAsync(category);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on post: \n {ex} \n {JsonConvert.SerializeObject(category)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Category category)
        {
            try
            {
                category.UserId = User.GetUserId();
                var response = await _categoryService.UpdateAsync(id, category);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on put: {id} \n {ex} \n {JsonConvert.SerializeObject(category)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _categoryService.DeleteAsync(User.GetUserId(), id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on delete: {id} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}
