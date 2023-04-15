using BL.FactElect;
using Common.Logs;
using Domain.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ApiSri.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultasController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly CConsultaSri _cConsultaSri;

        private readonly CCedulasSri _cedulasSri;
        public ConsultasController(CConsultaSri cConsultaSri, CCedulasSri cedulasSri, IConfiguration configuration)
        {
            _cConsultaSri = cConsultaSri;
            _cedulasSri = cedulasSri;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpGet("GetRucSRI")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<DatosPersonaSriUpdate> GetRucSRI([FromQuery] RUCSriDTo rUCSriDTo)
        {

            LogWriter _log = new LogWriter(_configuration);
            DatosPersonaSriUpdate _response = new DatosPersonaSriUpdate();
            try
            {
                if (!_cConsultaSri.CheckExistence(rUCSriDTo.Ruc))
                {
                    _response.Error = "Ruc no existe";
                    return _response;
                }

                string htmlResponse = string.Empty;

                CookieContainer cookieContainer = new CookieContainer();

                cookieContainer = _cConsultaSri.GetCookie(ref htmlResponse);

                if (cookieContainer == null)
                {
                    _response.Error = "No se pudo consultar la pagina";
                    return _response;
                }

                htmlResponse = _cConsultaSri.ValidateCaptcha(htmlResponse, cookieContainer);

                if (htmlResponse == null)
                {

                    _response.Error = "No se pudo validar el captcha";
                    return _response;
                }

                _response = _cConsultaSri.GetRucSri(rUCSriDTo.Ruc, cookieContainer, htmlResponse);
            }
            catch (Exception ex)
            {
                _log.LogError("Error GetRucSRI: " + ex.ToString());
                _response.Error = ex.Message;
            }
            return _response;
        }
        [AllowAnonymous]
        [HttpGet("GetCedulaSri")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<CCedulaSriDto> GetCedulaSri([FromQuery] RUCSriDTo cedula)
        {
            LogWriter _log = new LogWriter(_configuration);
            CCedulaSriDto _response = new CCedulaSriDto();
            try
            {
                if (!_cedulasSri.CheckExistence(cedula.Ruc))
                {
                    _response.Error = "Cedula No existe";
                    return _response;
                }

                string htmlResponse = string.Empty;

                CookieContainer cookieContainer = new CookieContainer();

                cookieContainer = _cedulasSri.GetCookie(ref htmlResponse);

                if (cookieContainer == null)
                {
                    _response.Error = "No se pudo consultar la pagina";
                    return _response;
                }

                htmlResponse = _cedulasSri.ValidateCaptcha(htmlResponse, cookieContainer);

                if (htmlResponse == null)
                {

                    _response.Error = "No se pudo validar el captcha";
                    return _response;
                }

                _response = _cedulasSri.GetCedulaSri(cedula.Ruc, cookieContainer, htmlResponse);
            }
            catch (Exception ex)
            {
                _log.LogError("Error GetCedulaSri: " + ex.ToString());
                _response.Error = ex.Message;
            }
            return _response;
        }
    }
}
