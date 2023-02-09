using Helpers;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Domain.Models;

namespace WebUI.Controllers.Reports
{
    public class TipoImpresoraController : Controller
    {
        private readonly IConfiguration _configuration;
        private DataAccessObject _dao;

        public TipoImpresoraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("ApiPrinter.TipoImpresora_Get", parameters)));
        }
    }
}
