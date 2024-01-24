using AutoMapper;
using Common.Core.Models;
using Configuracion.API.Entities;
using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    public class EstablecimientoLogoController : BaseApiController
    {
        private readonly IEstablecimientoLogoService _establecimientoLogoService;
        private readonly IMapper _mapper;
        private readonly LogWriter _log;
        public EstablecimientoLogoController(IEstablecimientoLogoService establecimientoLogoService,
            IMapper mapper,
            LogWriter logWriter)
        {
            _establecimientoLogoService = establecimientoLogoService;
            _mapper = mapper;
            _log = logWriter;
        }
        [HttpGet("{establecimientoId}")]
        public async Task<IActionResult> Get(int establecimientoId)
        {
            try
            {
                var response = await _establecimientoLogoService.GetAsync(establecimientoId);
                if (response == null) { return BadRequest($"No logo found: {establecimientoId}"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get: \n {ex} \n id: {establecimientoId}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("{establecimientoId}")]
        public async Task<IActionResult> Post(int establecimientoId, IFormFile file)
        {
            try
            {
                var logo = new FileModel();
                logo.CreateBytesCompressed(file);
                var estabLogo = _mapper.Map<EstablecimientoLogo>(logo);
                estabLogo.EstablecimientoId = establecimientoId;
                estabLogo.UserId = User.GetUserId();
                var response = await _establecimientoLogoService.AddAsync(estabLogo);
                if (response == null) { return BadRequest($"No response: {establecimientoId}"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Post: \n {ex} \n EstablecimientoId: {establecimientoId} ");
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Put/{id}")]
        public async Task<IActionResult> Put(int id, IFormFile file)
        {
            try
            {
                var logo = new FileModel();
                logo.CreateBytesCompressed(file);
                var estabLogo = _mapper.Map<EstablecimientoLogo>(logo);
                estabLogo.UserId = User.GetUserId();
                var response = await _establecimientoLogoService.UpdateAsync(id, estabLogo);
                if (response == null) { return BadRequest($"No response {id}"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Put:  \n {ex} \n id: {id}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _establecimientoLogoService.DeleteAsync(id);
                if (response == null) { return BadRequest($"No response {id}"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Delete:  \n {ex} \n id: {id}");
                return BadRequest(ex.Message);
            }
        }
    }
}
