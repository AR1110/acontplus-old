// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc;

// namespace ApiContabilidad.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class CuentaPorCobrarController : ControllerBase
//     {
//          private readonly IConfiguration _configuration;
//         private readonly DbAccess _dbAccess;
//         public CuentaPorCobrarController(IConfiguration configuration)
//         {
//             _configuration = configuration;
//             _dbAccess = new DbAccess(_configuration);
//         }

//         // GET: api/<CuentaPorCobrarController>
//         [HttpGet]
//         public async Task<IActionResult> Get(string json)
//         {
//             LogWriter _log = new LogWriter(_configuration);
//             GenericResponse _response = new GenericResponse();
//             try
//             {
//                 int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
//                 await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Get");
//                 _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
//                 _dbAccess.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
//                 _response = _dbAccess.GetDataSetAsync();
//             }
//             catch (Exception ex)
//             {
//                 _log.LogError("Error on Cuenta Por Pagar -> Get: \n" + ex.ToString());
//                 _response.Create(code: "0", message: "Error al traer las cuentas por pagar");
//             }
//             finally
//             {
//                 _dbAccess.Close();
//             }
//             return Ok(_response);
//         }

//         // POST api/<CuentaPorPagarController>
//         [HttpPost("{json}")]
//         public async Task<IActionResult> Post(string json)
//         {
//             LogWriter _log = new LogWriter(_configuration);
//             GenericResponse _response = new GenericResponse();
//             try
//             {
//                 int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
//                 await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Insert");
//                 _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
//                 _dbAccess.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
//                 _response = _dbAccess.GetDefault();
//             }
//             catch (Exception ex)
//             {
//                 _log.LogError("Error on Cuenta Por Pagar -> Post: \n" + ex.ToString());
//                 _response.Create(code: "0", message: "Error al insertar las cuentas por pagar");
//             }
//             finally
//             {
//                 _dbAccess.Close();
//             }
//             return Ok(_response);
//         }

//         // PUT api/<CuentaPorPagarController>/5
//         [HttpPut("{id}")]
//         public async Task<IActionResult> Put(int id, CuentaPorPagarDto data)
//         {
//             LogWriter _log = new LogWriter(_configuration);
//             GenericResponse _response = new GenericResponse();
//             try
//             {
//                 int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value); await _dbAccess.SPExecute("Contabilidad.CuentaPorPagar_Update");
//                 _dbAccess.AddDynamicParam("idUsuarioRol", idUsuarioRol);
//                 _dbAccess.AddDynamicParam("idCuentaPorPagar", id);
//                 _dbAccess.AddDynamicParam("json", SqlValidation.ValidateSqlString(data.cuotas));
//                 _response = _dbAccess.GetDefault();
//             }
//             catch (Exception ex)
//             {
//                 _log.LogError("Error on Cuenta Por Pagar -> Put: \n" + ex.ToString());
//                 _response.Create(code: "0", message: "Error al actualizar las cuentas por pagar");
//             }
//             finally
//             {
//                 _dbAccess.Close();
//             }
//             return Ok(_response);
//         }

//     }
// }