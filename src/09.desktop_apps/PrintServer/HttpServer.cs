using BL.Print;
using Common.Logs;
using Domain.Config.Dtos;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net;
using System.Text;
using System.Web;

namespace PrintServer
{
    public class HttpServer
    {
        //execute this on cmd like admin
        //reg add HKEY_CURRENT_USER\SOFTWARE\Policies\Google\Chrome /t REG_DWORD /v InsecurePrivateNetworkRequestsAllowed /d 1 /f
        //reg add HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Edge /t REG_DWORD /v InsecurePrivateNetworkRequestsAllowed /d 1 /f
        public static HttpListener listener;
        public static string url = "http://127.0.0.1:9100/";
        public static int pageViews = 0;
        public static int requestCount = 0;
        public static string pageData =
            "<!DOCTYPE>" +
            "<html>" +
            "  <head>" +
            "    <title>HttpListener Example</title>" +
            "  </head>" +
            "  <body>" +
            "    <p>Page Views: {0}</p>" +
            "    <form method=\"post\" action=\"shutdown\">" +
            "      <input type=\"submit\" value=\"Shutdown\" {1}>" +
            "    </form>" +
            "  </body>" +
            "</html>";


        public static async Task HandleIncomingConnections()
        {
            bool runServer = true;

            // While a user hasn't visited the `shutdown` url, keep on handling requests
            while (runServer)
            {
                try
                {
                    // Will wait here until we hear from a connection
                    HttpListenerContext ctx = await listener.GetContextAsync();

                    // Peel out the requests and response objects
                    HttpListenerRequest req = ctx.Request;
                    HttpListenerResponse resp = ctx.Response;

                    // Print out some info about the request
                    //Console.WriteLine("Request #: {0}", ++requestCount);
                    //Console.WriteLine(req.Url.ToString());
                    //Console.WriteLine(req.HttpMethod);
                    //Console.WriteLine(req.UserHostName);
                    //Console.WriteLine(req.UserAgent);
                    //Console.WriteLine();

                    // If `shutdown` url requested w/ POST, then shutdown the server after serving the page
                    if ((req.HttpMethod == "POST") && (req.Url.AbsolutePath == "/shutdown"))
                    {
                        //Console.WriteLine("Shutdown requested");
                        runServer = false;
                    }

                    //if (req.HttpMethod == "OPTIONS")
                    //{
                    //    resp.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, Authorization, X-IdUsuarioRol");
                    //    resp.AddHeader("Access-Control-Allow-Methods", "GET, POST");
                    //    resp.AddHeader("Access-Control-Max-Age", "1728000");
                    //}
                    resp.AppendHeader("Access-Control-Allow-Origin", "*");
                    resp.AppendHeader("Access-Control-Allow-Headers", "*");

                    // Make sure we don't increment the page views counter if `favicon.ico` is requested
                    if (req.Url.AbsolutePath != "/favicon.ico")
                        pageViews += 1;
                    string key = string.Empty, value = string.Empty;
                    string[] rawParams = req.Url.Query.Split('&');
                    Dictionary<string, string> _dparams = new Dictionary<string, string>();
                    foreach (string param in rawParams)
                    {
                        string[] kvPair = param.Split('=');
                        key = kvPair[0];
                        key = key.Replace("?", "");
                        value = HttpUtility.UrlDecode(kvPair[1]);
                        _dparams.Add(key, value);
                    }
                    var dataReport = new ApiPrintRequestDto();
                    dataReport.Create(_dparams);

                    if (new ThermalPrint().Print(dataReport))
                    {
                        var obj = new { code = "1", message = "Impresion correcta!" };
                        var json = JsonConvert.SerializeObject(obj);
                        pageData = json;
                        resp.StatusCode = 200;
                        resp.StatusDescription = "OK";
                    }
                    else
                    {
                        var obj = new { code = "0", message = "Error al imprimir!" };
                        var json = JsonConvert.SerializeObject(obj);
                        pageData = json;
                        resp.StatusCode = 400;
                        resp.StatusDescription = "Bad Request";
                    }

                    // Write the response info
                    string disableSubmit = !runServer ? "disabled" : "";
                    //byte[] data = Encoding.UTF8.GetBytes(String.Format(pageData, pageViews, disableSubmit));
                    byte[] data = Encoding.UTF8.GetBytes(pageData);
                    resp.ContentType = "application/json";
                    resp.ContentEncoding = Encoding.UTF8;
                    resp.ContentLength64 = data.LongLength;

                    //String dateAsString = DateTime.Now.ToString(@"MM\/dd\/yyyy h\:mm tt");

                    //byte[] bOutput = System.Text.Encoding.UTF8.GetBytes(dateAsString);
                    //resp.ContentType = "text/plain";
                    ////resp.ContentType = "application/json";
                    //resp.ContentLength64 = bOutput.Length; 

                    // Write out to the response stream (asynchronously), then close it
                    await resp.OutputStream.WriteAsync(data, 0, data.Length);
                    resp.Close();
                }
                catch (HttpListenerException hle)
                {
                    var appLog = new EventLog("Application");
                    var eventSource = "PrinterServer";
                    appLog.Source = EventsLogs.CreateEventSource(eventSource);
                    appLog.WriteEntry("HttpListener exception: " + hle.ToString(), EventLogEntryType.Error);
                    Console.WriteLine("Error in listener {0}", hle.Message);
                }
                catch (Exception ex)
                {
                    var appLog = new EventLog("Application");
                    var eventSource = "PrinterServer";
                    appLog.Source = EventsLogs.CreateEventSource(eventSource);
                    appLog.WriteEntry("Server Exception: " + ex.ToString(), EventLogEntryType.Error);
                    Console.WriteLine("Error in server {0}", ex.Message);
                    runServer = true;
                    // decide to continue or return
                }
            }
        }

        public static bool ValidateIPv4(string ip)
        {
            IPAddress address;
            return ip != null && ip.Count(c => c == '.') == 3 &&
                IPAddress.TryParse(ip, out address);
        }
        public static void Main(string[] args)
        {
            NetAclChecker.RunProcessAsAdmin();
            string myIP = string.Empty;
            try
            {
                // Create a Http server and start listening for incoming connections
                listener = new HttpListener();

                string hostname = Dns.GetHostName(); // Retrive the Name of HOST
                myIP = Dns.GetHostEntry(hostname).AddressList[0].ToString();
                for (int i = 0; i <= Dns.GetHostEntry(hostname).AddressList.Length - 1; i++)
                {
                    if (Dns.GetHostEntry(hostname).AddressList[i].IsIPv6LinkLocal == false)
                    {
                        var ipFounded = Dns.GetHostEntry(hostname).AddressList[i].ToString();

                        if (ValidateIPv4(ipFounded))
                        {
                            myIP = Dns.GetHostEntry(hostname).AddressList[i].ToString();
                        }
                    }
                }
                myIP = $"http://{myIP}:9200/";
                if (!string.IsNullOrEmpty(myIP) && myIP != "http://127.0.0.1:9100/")
                {
                    listener.Prefixes.Add(myIP);
                    var appLog = new EventLog("Application");
                    var eventSource = "PrinterServer";
                    appLog.Source = EventsLogs.CreateEventSource(eventSource);
                    appLog.WriteEntry($"Listening for connections on {myIP}", EventLogEntryType.Information);
                    appLog.WriteEntry($"Listening for connections on {url}", EventLogEntryType.Information);
                    Console.WriteLine("Listening for connections on {0}", myIP);
                    Console.WriteLine("Listening for connections on {0}", url);
                }
                else
                {
                    listener.Prefixes.Add(url);
                    var appLog = new EventLog("Application");
                    var eventSource = "PrinterServer";
                    appLog.Source = EventsLogs.CreateEventSource(eventSource);
                    appLog.WriteEntry($"Listening for connections on {url}", EventLogEntryType.Information);
                    Console.WriteLine("Listening for connections on {0}", url);
                }
                listener.Start();

                // Handle requests
                Task listenTask = HandleIncomingConnections();
                listenTask.GetAwaiter().GetResult();

                // Close the listener
                listener.Close();
            }
            catch (Exception ex)
            {
                var appLog = new EventLog("Application");
                var eventSource = "PrinterServer";
                appLog.Source = EventsLogs.CreateEventSource(eventSource);
                appLog.WriteEntry($"{myIP} \n {ex}", EventLogEntryType.Error);
            }

        }

    }
}
