using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using DataAccess;
using Common.Logs;

namespace WebUI.Controllers.FE
{
    [Authorize]
    public class DocumentoElectronicoController : Controller
    {
        private readonly IConfiguration _configuration;


        public DocumentoElectronicoController(IConfiguration configuration)
        {
            _configuration = configuration;
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
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                //var idUsuarioRol = Convert.ToInt32(HttpContext.Request.Headers["X-IdUsuarioRol"]);
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataTable("FactElect.Doc_Elect_Get", parameters));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while getting docs: \n" + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = "0",
                    message = "Error al obtener los documentos"
                });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetDataForm()
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                DAO _dao = new DAO(_configuration);

                return Ok(await _dao.GetDataSet("FactElect.Doc_Elect_Get_Data_Form"));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while getting data form: \n" + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = "0",
                    message = "Error al obtener los datos del formulario"
                });
            }
        }
        [HttpPut]
        public async Task<IActionResult> Put(int id)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "id", id }
                };
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.Default("FactElect.Doc_Elect_Update", parameters));
            }
            catch (Exception ex)
            {
                _log.LogError("Error while updating doc: \n" + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = "0",
                    message = "Error al actualizar el documento"
                });
            }
           
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
