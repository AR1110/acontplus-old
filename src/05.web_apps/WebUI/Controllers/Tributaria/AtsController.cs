using System.Data;
using DataAccess.GestionTributaria;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Domain.Enums;
using FactElect;
using Helpers;

namespace WebUI.Controllers.GestionTributaria
{
    public class AtsController : Controller
    {
        private readonly IConfiguration _configuration;

        private AtsDao _ats;
        private AtsXml _atsXml = new AtsXml();
        private GenericResponse _response = new GenericResponse();
        public AtsController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ats = new AtsDao(_configuration);
        }
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
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
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            DataSet ds = new DataSet();
            string msgError = "";
            try
            {
                if (_ats.Get(idRol, json, ref ds, ref _response))
                {
                    byte[] xmlAts = null;
                    if (_atsXml.Create(ref ds, ref xmlAts, ref msgError))
                    {
                        string fileName = "ATS_" + ds.Tables[0].Rows[0]["IdInformante"].ToString()
                        + "_" + ds.Tables[0].Rows[0]["numEstabRuc"].ToString()
                        + "_" + ds.Tables[0].Rows[0]["anio"].ToString() + "_"
                        + ds.Tables[0].Rows[0]["mes"].ToString();
                        return File(xmlAts, "text/xml", fileName + ".xml");
                    }
                    else
                    {
                        _response.Create("0", msgError);
                    }
                }
            }
            catch (Exception ex)
            {
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
