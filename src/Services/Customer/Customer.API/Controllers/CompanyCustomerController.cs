using Common.Core.Models;
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

        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest request)
        {
            try
            {
                var response = await _companyCustomer.AddAsync(new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json",  DataConverters.SerializeDictionary(request.Data)
                    }
                });
                if (response == null) { return BadRequest("Cant Save"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity($"Error on Get: \n {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            try
            {
                var response = await _companyCustomer.UpdateAsync(new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id },
                    { "json",  DataConverters.SerializeDictionary(request.Data) }
                });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Cant Save"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity($"Error on Get: \n {ex}");
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

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            try
            {
                var response = await _companyCustomer.GetIdAsync(new Dictionary<string, object> {
                    { "id", id }
                });
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity($"Error on Get Id: {id} \n {ex}");
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _companyCustomer.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logWriter.LogActivity("Error al eliminar el cliente: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
