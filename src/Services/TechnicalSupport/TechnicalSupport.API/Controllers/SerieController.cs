using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class SerieController : BaseApiController
    {
        private readonly ISerieService _serieService;
        private readonly ICustomLogger _log;
        public SerieController(ISerieService serieService, ICustomLogger log)
        {
            _serieService = serieService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _serieService.GetAsync();
                if (response == null) { return BadRequest("Can't Get Data"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get:" + ex.Message);
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Serie serie)
        {
            try
            {
                serie.UserId = User.GetUserId();
                var response = await _serieService.AddAsync(serie);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on post: \n {JsonConvert.SerializeObject(serie)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Serie serie)
        {
            try
            {
                serie.UserId = User.GetUserId();
                var response = await _serieService.UpdateAsync(id, serie);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on put: {id} \n {JsonConvert.SerializeObject(serie)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _serieService.DeleteAsync(User.GetUserId(), id);
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
