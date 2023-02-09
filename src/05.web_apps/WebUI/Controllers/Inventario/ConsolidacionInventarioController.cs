using WebUI.ApiClient;
using DataAccess.Inventario;
using WebUI.Utils;
using Domain.Models;
using Domain.ViewModels.Inventario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Helpers;

namespace WebUI.Controllers.Inventario
{
    public class ConsolidacionInventarioController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _urlApi = "";
        GenericResponse _gr = new();
        private ConsolidacionInventarioDao _cinv;
        public ConsolidacionInventarioController(IConfiguration config)
        {
            _config = config;
            _urlApi = _config.GetSection("UrlApis").GetSection("AcontPlusApi").Value;
            _cinv = new ConsolidacionInventarioDao(_config);
        }
     
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ConsolidacionInventarioViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cinv.InsertAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cinv.GetAsync(idRol, json);
            return Ok(res);
        }


        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] ConsolidacionInventarioViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cinv.UpdateAsync(idRol, id, data);
            return Ok(res);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cinv.DeleteAsync(idRol, id);
            return Ok(res);
        }

        public async Task<IActionResult> GetId(int id)
        {            
            var res = await _cinv.GetIdAsync(id);
            return Ok(res);
        }

        //Generar Reporte
        public async Task<IActionResult> Download([FromBody] ApiReportParams parameters)
        {
            try
            {



                parameters.idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
                var response = await new ApiServer(_urlApi).PostAsync<FileModel>("api/ConsolidacionInv/Get/", parameters);
                if (response.Content.Length > 0)
                {
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
    }
}
