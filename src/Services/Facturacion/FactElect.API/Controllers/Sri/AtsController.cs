using System.Data;
using System.Text;
using Common.Core.Enums;
using Common.Core.Models;
using DataAccess;
using FactElect.Application;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers.Sri
{
    [ApiController]
    [Route("api/[controller]")]
    public class AtsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public AtsController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        private AtsXml _atsXml = new AtsXml();
        [HttpGet("Get")]
        public IActionResult GetPeriods()
        {
            object[] periods = null;
            try
            {
                var years = new List<Year>();
                var months = Enum.GetValues(typeof(Calendar.Months))
                       .Cast<Calendar.Months>()
                       .Select(t => new Month
                       {
                           month = (short)t,
                           name = t.ToString()
                       });

                var totalYears = 13;

                var actualYear = DateTime.Now.Year;

                for (var i = 0; i < totalYears; i++)
                {
                    years.Add(new Year { year = actualYear - i });
                }
                periods = new object[] { years, months };
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            return Ok(periods);
        }
        [HttpGet("Download")]
        public async Task<IActionResult> Download(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ASPAtsGetData", true);
                _db.AddDynamicParam("idRol", idRol);
                _db.AddDynamicParam("json", json);
                var ds = _db.GetDataSet();
                if (!ds.Tables[0].Columns.Contains("code"))
                {
                    byte[] xmlAts = null;
                    if (_atsXml.Create(ref ds, ref xmlAts))
                    {
                        string fileName = "ATS_" + ds.Tables[0].Rows[0]["IdInformante"].ToString()
                        + "_" + ds.Tables[0].Rows[0]["numEstabRuc"].ToString()
                        + "_" + ds.Tables[0].Rows[0]["anio"].ToString() + "_"
                        + ds.Tables[0].Rows[0]["mes"].ToString();
                        return File(xmlAts, "text/xml", fileName + ".xml");
                    }
                    else
                    {
                        _response.Create("0", "No se pudo generar el ats");
                    }
                }
                else
                {
                    _response.Create("0", ds.Tables[0].Rows[0].Field<string>("message"));
                }
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while download ats: \n" + ex.ToString());
                _response.Create("0", ex.Message);
            }

            var stream = new MemoryStream();
            using StreamWriter file = new(stream, Encoding.UTF8);
            await file.WriteLineAsync(_response.message);
            file.Flush();
            var txtError = stream.ToArray();
            file.Close();
            if (stream != null)
            {
                stream.Dispose();
            }
            return File(txtError, "text/plain", "Error.txt");
        }
    }
}
