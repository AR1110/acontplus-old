using WebUI.ApiClient;
using DataAccess.Ventas;
using WebUI.Utils;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using DataAccess;
using Newtonsoft.Json;

namespace WebUI.Controllers.Ventas
{
    public class NotaEntregaController : Controller
    {
        private IConfiguration _config;
        private readonly string _urlApi = "";
        
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();
        private NotaEntregaDao _ne;

        public NotaEntregaController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _config = configuration;
            _urlApi = _config.GetSection("UrlApis").GetSection("AcontPlusApi").Value;            
            _dao = new DataAccessObject(_config);
            _ne = new NotaEntregaDao(_config);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }
                
        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = _idRol;
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Get", parameters)));

        }
       
        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.NotaEntrega_GetId", parameters)));

        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] NotaEntregaViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonNotaEntrega", JsonConvert.SerializeObject(data.notaEntrega));
            parameters.Add("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
            parameters.Add("jsonManejoArticulo", JsonConvert.SerializeObject(data.manejoArticulo));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Insert", parameters)));

        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] NotaEntregaViewModel data)
        {

            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            parameters.Add("jsonNotaEntrega", JsonConvert.SerializeObject(data.notaEntrega));
            parameters.Add("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
            parameters.Add("jsonManejoArticulo", JsonConvert.SerializeObject(data.manejoArticulo));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Update", parameters)));

        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Delete", parameters)));                       

        }

        public async Task<IActionResult> ConvertToFacturaVenta(int idNotaEntrega)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _ne.ConvertAsync(idRol, idNotaEntrega);
            return Ok(res);

        }

        //Generar Reporte
        [HttpPost]
        public async Task<IActionResult> Download([FromBody] ApiReportParams parameters)
        {
            try
            {
                parameters.idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
                var response = await new ApiServer(_urlApi).PostAsync<FileModel>("api/Reporte/Download/", parameters);
                if (response.Content.Length > 0)
                {

                    if (parameters.sendEmail)
                    {
                        var email = await SendEmailStructure(parameters, response.Content);
                        var responseEmail = new SendEmail().Send(email);
                        if (responseEmail)
                        {
                            _gr.id = "1";
                            _gr.message = "Nota de Entrega Enviada Correctamente";
                        }
                        else
                        {
                            _gr.id = "0";
                            _gr.message = "No se pudo enviar la Nota de Entrega";
                        }
                        return Ok(_gr);
                    }
                    return File(response.Content, response.ContentType, response.FileName);                    
                }
                else
                {
                    _gr.id = "0";
                    _gr.message = "Problemas en el servidor de documentos";
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return Ok(_gr);
        }


        public async Task<Email> SendEmailStructure(ApiReportParams send, byte[] pdfInvoice)
        {
            var email = new Email();
            List<FileModel> filesToEmail = new List<FileModel>();
            try
            {
                object[] res = await _ne.DataSendEmailAsync(send.dataParams);
                email = res[0] as Email;
                var streamPdf = new MemoryStream(pdfInvoice);
                IFormFile pdfInvoiceGenerated = new FormFile(streamPdf, 0, pdfInvoice.Length, "NotaEntrega", res[1].ToString() + ".pdf") { Headers = new HeaderDictionary(), ContentType = "application/pdf" };
                var pdfEmail = new FileModel
                {
                    FileName = FileExtensions.SanitizeFileName(pdfInvoiceGenerated.FileName),
                    ContentType = pdfInvoiceGenerated.ContentType,
                    Content = FileData.GetFileByte(pdfInvoiceGenerated)
                };
                filesToEmail.Add(pdfEmail);
                email.files = filesToEmail;
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }

            return email;
        }

    }
}
