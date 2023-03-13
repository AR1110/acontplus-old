using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class TestController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new(); 
        public TestController(IConfiguration config)
        {
            _config = config;
        }
        public IActionResult Index()
        {
            return View();
        }
        //public async Task<IActionResult> TestDateInServer()
        //{
        //    string date = Request.Form["dateTest"].ToString();
        //    DateTime dateInTime = Convert.ToDateTime(date);
        //    object[] response = await new _t.
        //    ViewData["dateFromServer"] = response;
        //    return Ok(response);
        //}
        [HttpPost]
        public void EncryptText()
        {
            string textToEncrypt = "";
            textToEncrypt = Request.Form["txtToEncrypt"].ToString();
            var encrypted = Encryption.EncryptString(_config.GetSection("keyEncrypt").Value, textToEncrypt);
            Console.WriteLine(encrypted);
        }
        //public IActionResult GetPrinter()
        //{
        //    string printers = string.Empty;
        //    GetAllPrinterList(ref printers);
        //    return Ok(printers);
        //}

        //private void GetAllPrinterList(ref string json)
        //{
        //    List<PrinterViewModel> printers = new List<PrinterViewModel>();
        //    try
        //    {
        //        ManagementScope objScope = new ManagementScope(ManagementPath.DefaultPath); //For the local Access
        //        objScope.Connect();

        //        SelectQuery selectQuery = new SelectQuery();
        //        selectQuery.QueryString = "Select * from win32_Printer";
        //        ManagementObjectSearcher MOS = new ManagementObjectSearcher(objScope, selectQuery);
        //        ManagementObjectCollection MOC = MOS.Get();
        //        foreach (ManagementObject mo in MOC)
        //        {
        //            PrinterViewModel item = new PrinterViewModel();
        //            item.name = mo["Name"].ToString();
        //            printers.Add(item);
        //        }
        //        json = JsonConvert.SerializeObject(printers);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogWritter.LogError("C:\\Printer\\Csharp", "0", ex.Message);
        //    }
           
        //}
    }
}
