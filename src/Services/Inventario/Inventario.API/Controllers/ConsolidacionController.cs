using Common.Core.Models;
using Common.Core.Utils;
using Inventario.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Extensions;
using Services.Common.Logs;

namespace Inventario.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ConsolidacionController : ControllerBase
{
    private readonly ICustomLogger _log;
    private readonly IConsolidacionService _service;

    public ConsolidacionController(IConsolidacionService service, ICustomLogger log)
    {
        _service = service;
        _log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
            var response = await _service.GetAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Obtener Consolidacion" + ex.Message + "\n" + json);
            return BadRequest("Error en get Consolidacion" + ex.Message);
        }
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await _service.GetIdAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Obtener Datos de Consolidacion" + ex.Message);
            return BadRequest("Error en get Data Consolidacion" + ex.Message);
        }
    }


    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", DataConverters.SerializeDictionary(data.Data) }
            };

            var response = await _service.AddAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Insertar Consolidacion" + ex.Message);
            return BadRequest("Error en Post Consolidacion" + ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
            var response = await _service.UpdateAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Actualizar Consolidacion" + ex.Message);
            return BadRequest("Error en Put Consolidacion" + ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
            var response = await _service.DeleteAsync(parameters);
            if (response == null) { return NoContent(); }

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error en Eliminar Consolidacion" + ex.Message);
            return BadRequest("Error en Delete Consolidacion" + ex.Message);
        }
    }
}
