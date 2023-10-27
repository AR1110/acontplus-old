using Contabilidad.Core.Entities;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace ApiContabilidad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubcategoriaController : ControllerBase
    {
        private readonly ContabilidadContext _context;
        private ISubCategoriaService _subcategoria;
        public SubcategoriaController(ContabilidadContext context,
            ISubCategoriaService subcategoria)
        {
            _context = context;
            _subcategoria = subcategoria;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json",  json}
                };
                var result = await _subcategoria.GetAsync(parameters);
                if (result == null) { return NoContent(); };
                return Ok(result);
            }
            catch (Exception)
            {
                return BadRequest("Error al traer las subcategorias");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SubCategoria data)
        {
            try
            {
                data.IdUsuario = User.GetUserId();
                data.IdEntidad = User.GetCompanyId();
                var result = await _subcategoria.InsertAsync(data);
                return Ok(result);
            }
            //catch(SqlException ex)
            //{
            //    _  = ex.Message;
            //}
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
