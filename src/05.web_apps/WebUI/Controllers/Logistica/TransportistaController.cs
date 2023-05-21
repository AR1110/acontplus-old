using DataAccess;
using DataAccess.Logistica;
using Domain.Models;
using Domain.Models.Logistica;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Logistica
{
    public class TransportistaController : Controller
    {
       
        public ViewResult Index()
        {
            return View();
        }       
    }
}
