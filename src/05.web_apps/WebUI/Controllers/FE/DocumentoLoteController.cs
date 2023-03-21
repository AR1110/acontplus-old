using DataAccess.FE;
using Domain.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.FE
{
    public class DocumentoLoteController : Controller
    {
        private readonly IConfiguration _configuration;
        //private readonly string _urlApi = "";
        //private ResponseFE _responseFE;
        private readonly DocumentoLoteDao _dl;
        public DocumentoLoteController(IConfiguration configuration)
        {
            //_responseFE = new ResponseFE(); 
            _configuration = configuration;
            _dl = new DocumentoLoteDao(_configuration);
            //_config = config;
        }

        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _dl.GetAsync(idRol, json));
        }
        public async Task<IActionResult> Post(string codDoc)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _dl.InsertAsync(idRol, codDoc));
        }
        //public async Task<IActionResult> Authorize(int idDocumentoLote)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    //_responseFE.estado = "EN CONSTRUCCIÓN";
        //    //_responseFE.message = "Gracias por la paciencia";
        //    DataSet ds = new DataSet();
        //    if (!_dl.AuthorizeAsync(idRol, idDocumentoLote, ref ds))
        //    {
        //        _responseFE.estado = "ERROR";
        //        _responseFE.message = "No se pudo obtener los documentos";
        //    }
        //    else
        //    {
        //        //if (_dex.Create("00", ds, ref _auth))
        //        //{
        //        //    _responseFE = await _gestionApi.AuthorizeAsync("api/DocumentoLote/Authorize", _auth);
        //        //}
        //    }
        //    return Ok(_responseFE);
        //}
        public async Task<IActionResult> Delete(int idDocumentoLote)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _dl.DeleteAsync(idRol, idDocumentoLote));
        }
    }
}
