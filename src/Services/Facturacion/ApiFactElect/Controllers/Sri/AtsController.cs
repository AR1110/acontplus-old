using DataAccess;
using Domain.Enums;
using Domain.Models;
using FactElect.Application;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using System.Data;
using System.Text;

namespace ApiFactElect.Controllers.Sri
{
    [ApiController]
    [Route("api/[controller]")]
    public class AtsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public AtsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        private AtsXml _atsXml = new AtsXml();
        [HttpGet("Get")]
        public IActionResult GetPeriods()
        {
            object[] periods = null;
            try
            {
                List<Year> years = new List<Year>();
                var months = Enum.GetValues(typeof(CalendarEnum.Months))
                       .Cast<CalendarEnum.Months>()
                       .Select(t => new Month
                       {
                           month = ((short)t),
                           name = t.ToString()
                       });

                int totalYears = 13;

                int actualYear = DateTime.Now.Year;

                for (int i = 0; i < totalYears; i++)
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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
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
                LogWriter _log = new LogWriter(_configuration);
                _log.LogActivity("Error while download ats: \n" + ex.ToString());
                _response.Create("0", ex.Message);
            }

            MemoryStream stream = new MemoryStream();
            using StreamWriter file = new(stream, Encoding.UTF8);
            await file.WriteLineAsync(_response.message);
            file.Flush();
            byte[] txtError = stream.ToArray();
            file.Close();
            if (stream != null)
            {
                stream.Dispose();
            }
            return File(txtError, "text/plain", "Error.txt");
        }
    }
}