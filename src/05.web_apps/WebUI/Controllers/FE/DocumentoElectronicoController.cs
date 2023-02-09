using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using DataAccess;

namespace WebUI.Controllers.FE
{
    [Authorize]
    public class DocumentoElectronicoController : Controller
    {
        private DataAccessObject _dao;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private readonly int _idRol;
        private readonly IConfiguration _configuration;

        public DocumentoElectronicoController(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult ConfigDocElect()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.Doc_Elect_Get", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetDataForm()
        {
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("FactElect.Doc_Elect_Get_Data_Form")));
        }
        [HttpPut]
        public async Task<IActionResult> Put(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.Doc_Elect_Update", parameters)));
        }

       

        //public IActionResult SignMassive([FromBody] List<DocumentoElectronico> data)
        //{
        //    try
        //    {
        //        int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //        foreach (DocumentoElectronico item in data)
        //        {
        //            DataSet ds = new DataSet();
        //            if (_de.GetAuthorize(idRol, item.codDoc, item.idDocumento, true, ref ds))
        //            {
        //                //if (_dex.Create(item.codDoc, ds, ref _auth))
        //                //{
        //                //    _gestionApi.SignXml("api/DocumentoElectronico/Sign", _auth);
        //                //}
        //            }
        //        }
        //        _response.estado = "FIRMADOS";
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.estado = "ERROR";
        //        _response.message = ex.Message;
        //    }
        //    return Ok(_response);
        //}
        //public async Task<IActionResult> SignSingle(string codDoc, long idDocumento)
        //{
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //        if (_de.GetAuthorize(idRol, codDoc, idDocumento, true, ref ds))
        //        {
        //            //if (_dex.Create(codDoc, ds, ref _auth))
        //            //{
        //            //    _response = await _gestionApi.SignAsync("api/DocumentoElectronico/Sign", _auth);
        //            //}
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.estado = "ERROR";
        //        _response.message = ex.Message;
        //    }
        //    return Ok(_response);
        //}
        //public async Task<IActionResult> Authorize(string codDoc, long idDocumento)
        //{
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //        if (_de.GetAuthorize(idRol, codDoc, idDocumento, false, ref ds))
        //        {
        //            string xml = ds.Tables[0].Columns.Contains("xmlAcontPlus") ? ds.Tables[0].Rows[0]["xmlAcontPlus"].ToString() : "";
        //            if (!string.IsNullOrEmpty(xml))
        //            {
        //                string jsonAuth = DataHelper.DataTableToJSON(ds.Tables[1]);
        //                List<AuthorizationDto> listAuth = JsonConvert.DeserializeObject<List<AuthorizationDto>>(jsonAuth);
        //                _auth = listAuth[0];
        //                _auth.xml = xml;
        //                //_response = await _gestionApi.AuthorizeAsync("api/DocumentoElectronico/AuthorizeWithXmlSigned", _auth);
        //            }
        //            else
        //            {
        //                //if (_dex.Create(codDoc, ds, ref _auth))
        //                //{
        //                //    _response = await _gestionApi.AuthorizeAsync("api/DocumentoElectronico/Authorize", _auth);
        //                //}
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.estado = "ERROR";
        //        _response.message = ex.Message;
        //    }
        //    return Ok(_response);
        //}
        //public IActionResult AuthorizeMassive([FromBody] List<DocumentoElectronico> data)
        //{
        //    try
        //    {
        //        int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //        foreach (DocumentoElectronico item in data)
        //        {
        //            DataSet ds = new DataSet();
        //            if (_de.GetAuthorize(idRol, item.codDoc, item.idDocumento, false, ref ds))
        //            {
        //                string claveAcceso = ds.Tables[0].Columns.Contains("claveAcceso") ? ds.Tables[0].Rows[0]["claveAcceso"].ToString() : "";
        //                string ambiente = ds.Tables[0].Columns.Contains("ambiente") ? ds.Tables[0].Rows[0]["ambiente"].ToString() : "";

        //                string jsonAuth = DataHelper.DataTableToJSON(ds.Tables[1]);
        //                List<AuthorizationDto> listAuth = JsonConvert.DeserializeObject<List<AuthorizationDto>>(jsonAuth);
        //                _auth = listAuth[0];
        //                //_gestionApi.MultipleAuthorization("api/DocumentoElectronico/PutAuth/" + claveAcceso + "/" + ambiente, _auth);
        //            }
        //        }
        //        _response.estado = "AUTORIZADOS";
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.estado = "ERROR";
        //        _response.message = ex.Message;
        //    }
        //    return Ok(_response);
        //}
    }
}
