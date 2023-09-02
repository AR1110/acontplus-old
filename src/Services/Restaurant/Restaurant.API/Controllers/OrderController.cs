using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{
    public class OrderController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly LogWriter _log;
        public OrderController(IOrderService orderService, LogWriter log)
        {
            _orderService = orderService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    { "userRoleId", User.GetUserRoleId()},
                    { "json", json}
                };
                var orders = await _orderService.GetAsync(parameters);
                if (orders == null)
                {
                    _log.LogActivity("No se encontro datos");
                    return NoContent();
                }
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: \n" + ex.ToString());
                return BadRequest("Error on get");
            }
        }

        [HttpGet("Print/{id}")]
        public async Task<IActionResult> Print(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    { "userRoleId", User.GetUserRoleId()},
                    { "id", id}
                };
                var prints = await _orderService.PrintAsync(parameters);
                if (prints == null | string.IsNullOrEmpty(prints))
                {
                    _log.LogActivity("No se encontró datos");
                    return NoContent();
                }
                return Ok(prints);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on print {ex.Message}");
                return BadRequest("Error on print " + ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try
            {
                //var parameters = new Dictionary<string, object> {
                //    { "userRoleId", User.GetUserRoleId() },
                //    { "json", JsonConvert.SerializeObject(data) }
                //};
                data.UserRoleId = User.GetUserRoleId();
                var response = await _orderService.AddAsync(data);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo guardar"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on save: " + ex.ToString());
                return BadRequest("Error On Save");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _orderService.PutAsync(id, data);
                if (response == null | string.IsNullOrEmpty(response))
                {
                    _log.LogActivity("Error on update");
                    return BadRequest("No se pudo actualizar");
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on put catch " + ex.ToString());
                return BadRequest("Error On Put");
            }
        }
        [HttpPost("Report/{id}")]
        public async Task<IActionResult> GetReport(int id)
        {
            try
            {
                var data = await _orderService.GetReportAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } });
                if (data == null) { return BadRequest("No se pudo obtener el reporte"); };
                return File(data.FileContents, data.ContentType, data.FileDownloadName);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error getting order report: " + ex.ToString());
                return BadRequest("Error al obtener el reporte");
            }
        }
    }
}
