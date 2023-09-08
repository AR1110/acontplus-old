using Common.Infrastructure.Repository;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{
    public class MenuItemController : BaseApiController
    {
        private readonly IADORepository _repository;
        private readonly LogWriter _log;
        public MenuItemController(IADORepository repository, LogWriter log)
        {
            _repository = repository;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var ds = await _repository.GetDataSetAsync("RestaurantContext", "Restaurant.MenuItem_Get", new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return BadRequest("Not found");
                }
                var response = Converters.DataSetToJSON(ds);
                if (response == null) { return BadRequest("Not found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on get MenuItems: \n" + ex.ToString());
                return BadRequest("Error al obtener los detalles: " + ex.Message);
            }
        }
    }
}
