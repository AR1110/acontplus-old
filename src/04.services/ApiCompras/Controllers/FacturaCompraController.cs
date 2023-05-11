using DataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiCompras.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaCompraController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public FacturaCompraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }
    }
}
