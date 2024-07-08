namespace Configuracion.API.Controllers
{
    public class ImportacionController : BaseApiController
    {
        private readonly IConfiguration _configuration;

        public ImportacionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = new ApiResponseDeprecated();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Importaciones.TipoImportacion_Get");
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = await _db.GetDataTableAsync();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("GetValidation/{codImportacion}")]
        public async Task<IActionResult> GetValidation(string codImportacion, [FromBody] ImportacionParams data)
        {
            var response = new ApiResponseDeprecated();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Importaciones.Valid_Datos_Get");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("codImportacion", codImportacion);
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(data.jsonParams));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{codImportacion}")]
        public async Task<IActionResult> Post(string codImportacion, [FromBody] ImportacionParams data)
        {
            var response = new ApiResponseDeprecated();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute(StoredProcedureDynamic(codImportacion) + "_Insert");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(data.jsonParams));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public static string StoredProcedureDynamic(object cod)
        {
            string storedProcedure = "";
            switch (cod)
            {
                case "AR":
                    storedProcedure = "Importaciones.Articulo";
                    break;
                case "AF":
                    storedProcedure = "Importaciones.Fraccionado";
                    break;
                case "SF":
                    storedProcedure = "Importaciones.SubFamilia";
                    break;
                case "ME":
                    storedProcedure = "Importaciones.Medida";
                    break;
                case "MA":
                    storedProcedure = "Importaciones.Marca";
                    break;
                case "MO":
                    storedProcedure = "Importaciones.Modelo";
                    break;
                case "CL":
                    storedProcedure = "Importaciones.Cliente";
                    break;
                case "PR":
                    storedProcedure = "Importaciones.Proveedor";
                    break;
            }
            return storedProcedure;
        }
    }
}
