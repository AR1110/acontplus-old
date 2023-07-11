using Customer.API.Data;
using Customer.API.Dtos;
using Customer.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Services.Common.Logs;
using Services.Common.Utils;
using System.Data;
using System.Net;

namespace Customer.API.Controllers
{
    public class ConsultasController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly RucService _cConsultaSri;
        private readonly CedulaService _cedulasSri;
        private readonly CustomerContext _customerContext;
        public ConsultasController(RucService cConsultaSri,
            CedulaService cedulasSri,
            IConfiguration configuration,
            CustomerContext customerContext
            )
        {
            _cConsultaSri = cConsultaSri;
            _cedulasSri = cedulasSri;
            _configuration = configuration;
            _customerContext = customerContext;
        }

        [HttpGet("GetRucSRI")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<DatosPersonaSriUpdate> GetRucSRI([FromQuery] RUCSriDTo rUCSriDTo)
        {

            LogWriter _log = new LogWriter(_configuration);
            DatosPersonaSriUpdate _response = new DatosPersonaSriUpdate();
            try
            {
                DataTable dt = new DataTable();
                using (var command = _customerContext.Database.GetDbConnection().CreateCommand())
                {
                    var query = @"SELECT IDCard numeroRuc, BusinessName razonSocial, ISNULL(TradeName, '') nombreComercial, ISNULL([Address], '') direccion,
                                ISNULL(telephone,'') telefono, ISNULL(email, '') email
                                FROM Customer.Customer WHERE IDCard = @ruc AND SriValidation = 1";
                    command.CommandText = "Customer.Customer_IDCard_Get";
                    SqlParameter paramId = new SqlParameter("@id", SqlDbType.VarChar);
                    paramId.Value = rUCSriDTo.Ruc;
                    command.Parameters.Add(paramId);
                    command.CommandType = CommandType.StoredProcedure;
                    _customerContext.Database.OpenConnection();
                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = (SqlCommand)command;
                        adapter.Fill(dt);
                    }
                    if (dt.Rows.Count > 0)
                    {
                        return DataTableMapper.BindData<DatosPersonaSriUpdate>(dt);
                    }
                }

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
                if (_response.Establecimientos.Count > 0)
                {
                   _response.direccion = _response.Establecimientos[0].direccionCompleta;
                    if (_response.Establecimientos[0].nombreFantasiaComercial!=null)
                    {
                        _response.nombreComercial = _response.Establecimientos[0].nombreFantasiaComercial.ToString();
                    }
                    //_response.email = "";
                    //_response.telefono = "";
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error GetRucSRI: " + ex.ToString());
                _response.Error = ex.Message;
            }
            return _response;
        }

        [HttpGet("GetCedulaSri")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<CCedulaSriDto> GetCedulaSri([FromQuery] RUCSriDTo rUCSriDTo)
        {
            LogWriter _log = new LogWriter(_configuration);
            CCedulaSriDto _response = new CCedulaSriDto();
            try
            {
                DataTable dt = new DataTable();
                using (var command = _customerContext.Database.GetDbConnection().CreateCommand())
                {
                    var query = @"SELECT IDCard numeroRuc, BusinessName razonSocial, ISNULL(TradeName, '') nombreComercial, ISNULL([Address], '') direccion,
                                ISNULL(telephone,'') telefono, ISNULL(email, '') email
                                FROM Customer.Customer WHERE IDCard = @ruc AND SriValidation = 1";
                    command.CommandText = "Customer.Customer_IDCard_Get";
                    SqlParameter paramId = new SqlParameter("id", SqlDbType.VarChar);
                    paramId.Value = rUCSriDTo.Ruc;
                    command.Parameters.Add(paramId);
                    SqlParameter pIdT = new SqlParameter("IDType", SqlDbType.VarChar);
                    pIdT.Value = "05";
                    command.Parameters.Add(pIdT);
                    command.CommandType = CommandType.StoredProcedure;
                    _customerContext.Database.OpenConnection();
                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = (SqlCommand)command;
                        adapter.Fill(dt);
                    }
                    if (dt.Rows.Count > 0)
                    {
                        return DataTableMapper.BindData<CCedulaSriDto>(dt);
                    }
                }

                if (!_cedulasSri.CheckExistence(rUCSriDTo.Ruc))
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

                _response = _cedulasSri.GetCedulaSri(rUCSriDTo.Ruc, cookieContainer, htmlResponse);
            }
            catch (Exception ex)
            {
                _log.LogError("Error GetCedulaSri: " + ex.ToString());
                _response.Error = ex.Message;
            }
            return _response;
        }
        //private static void AddSqlParameter(SqlCommand command, string paramValue)
        //{
        //    SqlParameter parameter = new SqlParameter("@Description", SqlDbType.VarChar);
        //    parameter.IsNullable = true;
        //    parameter.Direction = ParameterDirection.Output;
        //    parameter.Size = 88;
        //    parameter.Value = paramValue;

        //    command.Parameters.Add(parameter);
        //}
    }
}
