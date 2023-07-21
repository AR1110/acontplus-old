using Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace WebUI.Controllers
{
    public class TestController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        private GenericResponse _gr = new();

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
        public async Task<IActionResult> EncryptText()
        {
            string textToEncrypt = "";
            textToEncrypt = Request.Form["txtToEncrypt"].ToString();
            var encrypted = Encryption.EncryptString(_config.GetSection("keyEncrypt").Value, textToEncrypt);

            //var client = new HttpClient(new HttpClientHandler()
            //{
            //    AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip,
            //    Credentials = CredentialCache.DefaultCredentials,
            //    UseDefaultCredentials = true

            //})
            //{ Timeout = TimeSpan.FromSeconds(90) };

            //var request = new HttpRequestMessage(HttpMethod.Get, _config.GetSection("urlSriCatastro").Value + "2200386874001");
            //client.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Encoding", "gzip, deflate");
            //client.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:19.0) Gecko/20100101 Firefox/19.0");
            //client.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Charset", "ISO-8859-1");
            //var response = await client.SendAsync(request);
            //response.EnsureSuccessStatusCode();
            //client.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml");

            //Console.WriteLine(await response.Content.ReadAsStringAsync());
            return Ok(encrypted);
        }

        [HttpPost]
        public IActionResult GenerateRandomKey()
        {
            var key = new byte[32];
            using (var generator = RandomNumberGenerator.Create())
            {
                generator.GetBytes(key);
            }
            return Ok(Convert.ToBase64String(key));
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