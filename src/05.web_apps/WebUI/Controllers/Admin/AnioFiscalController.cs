using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using DataAccess;

namespace WebUI.Controllers
{
    public class AnioFiscalController : Controller
    {
        // GET: AnioFiscal
       
        readonly AnioFiscalDao _af = new();
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]AnioFiscal data)
        {
            var res  = await _af.CreateAnioFiscalAsync(data);
            return Ok(res);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            var res = await _af.ReadAnioFiscal(pageIndex, pageSize);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody]AnioFiscal data)
        {
            var res = await _af.UpdateAnioFiscalAsync(data);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] AnioFiscal data)
        {
            var res = await _af.DeleteAnioFiscalAsync(data);
            return Ok(res);
        }

        //Get  Anio para select en modulo entidad 
        public IActionResult GetBy()
        {
            var res = _af.GetBy();
            return Ok(res);
        }

        public IActionResult GetAll()
        {
            var res = _af.GetBy();
            return Ok(res);
        }
    }
}