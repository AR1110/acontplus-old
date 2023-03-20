using Newtonsoft.Json;
using PrinterServer.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace PrinterServer
{
    public class HttpServer
    {
        //execute this on cmd like admin
        //reg add HKEY_CURRENT_USER\SOFTWARE\Policies\Google\Chrome /t REG_DWORD /v InsecurePrivateNetworkRequestsAllowed /d 1 /f
        //reg add HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Edge /t REG_DWORD /v InsecurePrivateNetworkRequestsAllowed /d 1 /f
        public static HttpListener listener;
        public static string url = "http://127.0.0.1:8000/";
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

                    resp.AppendHeader("Access-Control-Allow-Headers", "*");
                    resp.AppendHeader("Access-Control-Allow-Origin", "*");

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
                    //Console.WriteLine($"key: {key}");
                    //Console.WriteLine($"value: {value}");
                    

                    var dataReport = new ApiPrintRequest();
                    Dictionary<string, string> rdlcProps = new Dictionary<string, string>();

                    Dictionary<string, string> rdlcParams = new Dictionary<string, string>();

                    Dictionary<string, List<Dictionary<string, string>>> ldDataSources = new Dictionary<string, List<Dictionary<string, string>>>();

                    foreach (var item in _dparams)
                    {
                        if (item.Key == "rdlcProps")
                        {
                            var _arrayProps = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value);
                            foreach (var paramRdlc in _arrayProps.FirstOrDefault())
                            {
                                rdlcProps.Add(paramRdlc.Key, paramRdlc.Value);
                            }
                            dataReport.rdlcProps = rdlcProps;
                        }
                        if (item.Key == "dataSources")
                        {
                            var arrayDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());

                            foreach (var dataSource in arrayDS.FirstOrDefault())
                            {
                                var dataDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(dataSource.Value);
                                List<Dictionary<string, string>> dataSources = new List<Dictionary<string, string>>();

                                foreach (var valueII in dataDS)
                                {
                                    Dictionary<string, string> itemDs = new Dictionary<string, string>();
                                    foreach (var de in valueII)
                                    {
                                        itemDs.Add(de.Key, de.Value);
                                    }
                                    dataSources.Add(itemDs);
                                }
                                ldDataSources.Add(dataSource.Key, dataSources);
                            }
                            dataReport.dataSources = ldDataSources;
                        }
                        if (item.Key == "rdlcParams" && item.Value != "undefined")
                        {
                            var _arrayParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value);
                            foreach (var paramRdlc in _arrayParams.FirstOrDefault())
                            {
                                rdlcParams.Add(paramRdlc.Key, paramRdlc.Value);
                            }
                            dataReport.rdlcParams = rdlcParams;
                        }
                    }

                    if (PrintReport.DynamicPrint(dataReport))
                    {
                        resp.StatusCode = 200;
                        resp.StatusDescription = "OK";
                    }
                    else
                    {
                        resp.StatusCode = 400;
                        resp.StatusDescription = "Bad Request";
                    }

                    // Write the response info
                    string disableSubmit = !runServer ? "disabled" : "";
                    byte[] data = Encoding.UTF8.GetBytes(String.Format(pageData, pageViews, disableSubmit));
                    resp.ContentType = "text/html";
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
                    appLog.Source = CreateEventSource(eventSource);
                    appLog.WriteEntry(hle.StackTrace, EventLogEntryType.Error); 
                    Console.WriteLine("Error in listener {0}", hle.Message);
                }
                catch (Exception ex)
                {
                    var appLog = new EventLog("Application");
                    var eventSource = "PrinterServer";
                    appLog.Source = CreateEventSource(eventSource);
                    appLog.WriteEntry(ex.StackTrace, EventLogEntryType.Error); 
                    Console.WriteLine("Error in server {0}", ex.Message);
                    runServer = true;
                    // decide to continue or return
                }
            }
        }


        public static void Main(string[] args)
        {
            //Desaparecemos la consola
            //Magician.DisappearConsole();

            // Create a Http server and start listening for incoming connections
            listener = new HttpListener();
            listener.Prefixes.Add(url);
            listener.Start();
            Console.WriteLine("Listening for connections on {0}", url);

            // Handle requests
            Task listenTask = HandleIncomingConnections();
            listenTask.GetAwaiter().GetResult();

            // Close the listener
            listener.Close();
        }
        public static string CreateEventSource(string currentAppName)
        {
            string eventSource = currentAppName;
            bool sourceExists;
            try
            {
                // searching the source throws a security exception ONLY if not exists!
                sourceExists = EventLog.SourceExists(eventSource);
                if (!sourceExists)
                {   // no exception until yet means the user as admin privilege
                    EventLog.CreateEventSource(eventSource, "Application");
                }
            }
            catch (SecurityException)
            {
                eventSource = "Application";
            }

            return eventSource;
        }

    }
}
