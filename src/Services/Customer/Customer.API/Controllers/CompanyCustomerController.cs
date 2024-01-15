using Common.Core.Utils;
using Customer.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Customer.API.Controllers
{
    public class CompanyCustomerController : BaseApiController
    {
        private readonly ICompanyCustomerService _companyCustomer;
        private LogWriter _logWriter;
        public CompanyCustomerController(ICompanyCustomerService companyCustomer, LogWriter logWriter)
        {
            _companyCustomer = companyCustomer;
            _logWriter = logWriter;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _companyCustomer.GetAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity($"Error on Get: {json} \n {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search(string json)
        {
            try
            {
                var response = await _companyCustomer.SearchAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity($"Error on Get: {json} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}
