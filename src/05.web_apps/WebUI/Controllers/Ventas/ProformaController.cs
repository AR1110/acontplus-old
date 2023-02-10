using WebUI.ApiClient;
using DataAccess.Ventas;
using WebUI.Utils;
using Domain.Models;
using Domain.ViewModels.Ventas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using DataAccess;

namespace WebUI.Controllers.Ventas
{
    public class ProformaController : Controller
    {

        private readonly string _urlApi = "";
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();
        private ProformaDao _prof;

        public ProformaController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _urlApi = configuration.GetSection("UrlApis").GetSection("AcontPlusApi").Value;
            _dao = new DataAccessObject(_configuration);
            _prof = new ProformaDao(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);

        }
       
        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _prof.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.Proforma_GetId", parameters)));

        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ProformaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _prof.InsertAsync(idRol, data);
            return Ok(res);

        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] ProformaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _prof.UpdateAsync(idRol, id, data);
            return Ok(res);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Proforma_Delete", parameters)));

        }



        public async Task<IActionResult> ConvertToDocument(string codigoDoc, int idProforma, int idTiempoCredito)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _prof.ConvertAsync(idRol, codigoDoc, idProforma, idTiempoCredito);
            return Ok(res);
        }

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
                            _gr.message = "Proforma Enviada Correctamente";
                        }
                        else
                        {
                            _gr.id = "0";
                            _gr.message = "No se pudo enviar la Proforma";
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
                object[] res = await _prof.DataSendEmailAsync(send.dataParams);
                email = res[0] as Email;
                var streamPdf = new MemoryStream(pdfInvoice);
                IFormFile pdfInvoiceGenerated = new FormFile(streamPdf, 0, pdfInvoice.Length, "Proforma", res[1].ToString() + ".pdf") { Headers = new HeaderDictionary(), ContentType = "application/pdf" };
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
