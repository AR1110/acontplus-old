using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Common.TestApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController(IAdoSqlServer adoSqlServer) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post()
        {
            try
            {
                var parameters = new Dictionary<string, object>
            {
                {"codeValue", "FROM API PUES" }
            };
                var response = await adoSqlServer.SpExecuteAsync<ApiResponse>("dbo.Sp_Parent", parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
          
        }

        [HttpPost("PostChild")]
        public async Task<IActionResult> PostChild()
        {
            try
            {
                var parameters = new Dictionary<string, object>
            {
                {"codeValue", "FROM API CHILD PUES" }
            };
                var response = await adoSqlServer.SpExecuteAsync<ApiResponse>("dbo.Sp_Child", parameters);
                return Ok(response);
            }
           
            catch(SqlException sqlex)
            {
                return BadRequest(sqlex);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }
    }
}
