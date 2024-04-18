using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class BrandController : BaseApiController
    {
        private readonly IBrandService _brandService;
        private readonly ICustomLogger _log;
        public BrandController(IBrandService brandService, ICustomLogger log)
        {
            _brandService = brandService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _brandService.GetAsync();
                if (response == null) { return BadRequest("Can't Get brand"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get:" + ex.Message);
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Brand brand)
        {
            try
            {
                brand.UserId = User.GetUserId();
                var response = await _brandService.AddAsync(brand);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on post: \n {JsonConvert.SerializeObject(brand)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Brand brand)
        {
            try
            {
                brand.UserId = User.GetUserId();
                var response = await _brandService.UpdateAsync(id, brand);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on put: {id} \n {JsonConvert.SerializeObject(brand)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _brandService.DeleteAsync(User.GetUserId(), id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on delete: {id}");
                return BadRequest(ex.Message);
            }
        }
    }
}
