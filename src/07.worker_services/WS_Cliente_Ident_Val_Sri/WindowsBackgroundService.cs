using Common.Logs;
using Newtonsoft.Json;
using System.Data;
using System.Net;

namespace WS_Cliente_Ident_Val_Sri
{
    public class WindowsBackgroundService : BackgroundService
    {
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly IdentificacionValidacionService _identificacionValidacionService;
        private readonly IConfiguration _configuration;
        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
            IdentificacionValidacionService identificacionValidacionService,
            IConfiguration configuration)
        {
            _logger = logger;
            _identificacionValidacionService = identificacionValidacionService;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    DataTable dt = await _identificacionValidacionService.Get(Convert.ToInt32(_configuration.GetSection("cantDocs").Value));
                    if (!dt.Columns.Contains("code") && dt.Rows.Count > 0)
                    {
                        Parallel.ForEach(dt.AsEnumerable(), async drow =>
                        {
                            if (drow.Field<string>("codigoSri") == "04")
                            {
                                await ValidateRuc(drow);
                            }
                            if (drow.Field<string>("codigoSri") == "05")
                            {
                                await ValidateCedula(drow);
                            }
                        });
                    }
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                Environment.Exit(1);
            }

        }
        public async Task ValidateRuc(DataRow drow)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                var cliente = new HttpClient(new HttpClientHandler() { Credentials = CredentialCache.DefaultNetworkCredentials });
                HttpResponseMessage response = await cliente.GetAsync(_configuration.GetSection("urlSriRucValidation").Value + drow.Field<string>("numeroIdentificacion"));
                var exists = response.Content.ReadAsStringAsync();
                Dictionary<string, object> deserialized = JsonConvert.DeserializeObject<Dictionary<string, object>>(exists.Result);

                deserialized.TryGetValue("error", out object error);
                if (error != null)
                {
                    _log.LogWarning(drow.Field<string>("numeroIdentificacion") + "  " + drow.Field<string>("razonSocial"));
                    await _identificacionValidacionService.Insert(_configuration.GetSection("tipo").Value == "1" ? drow.Field<int>("idCliente") : drow.Field<int>("idProveedor"), drow.Field<string>("numeroIdentificacion"), drow.Field<string>("razonSocial"));
                }
                else
                {
                    var razonSocial = deserialized.FirstOrDefault(x => x.Key == "razonSocial").Value.ToString();

                    var establecimientos = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(deserialized.FirstOrDefault(x => x.Key == "establecimientos").Value.ToString());

                    string nombreComer = string.Empty;
                    foreach (var item in establecimientos)
                    {
                        if (item.FirstOrDefault(x => x.Key == "matriz").Value == "SI")
                        {
                            nombreComer = item.FirstOrDefault(x => x.Key == "nombreFantasiaComercial").Value;
                        }
                    }
                    await _identificacionValidacionService.Update(_configuration.GetSection("tipo").Value == "1" ? drow.Field<int>("idCliente") : drow.Field<int>("idProveedor"), razonSocial, nombreComer);
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error while validation ruc" + ex.ToString());
                _ = ex.Message;
            }
        }
        public async Task ValidateCedula(DataRow drow)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                var cliente = new HttpClient(new HttpClientHandler() { Credentials = CredentialCache.DefaultNetworkCredentials });
                HttpResponseMessage response = await cliente.GetAsync(_configuration.GetSection("urlSriCedValidation").Value + drow.Field<string>("numeroIdentificacion"));
                var exists = response.Content.ReadAsStringAsync();
                Dictionary<string, object> deserialized = JsonConvert.DeserializeObject<Dictionary<string, object>>(exists.Result);
                deserialized.TryGetValue("error", out object error);
                if (error != null)
                {
                    _log.LogWarning(drow.Field<string>("numeroIdentificacion") + "  " + drow.Field<string>("razonSocial"));
                    await _identificacionValidacionService.Insert(_configuration.GetSection("tipo").Value == "1" ? drow.Field<int>("idCliente") : drow.Field<int>("idProveedor"), drow.Field<string>("numeroIdentificacion"), drow.Field<string>("razonSocial"));
                }
                else
                {
                    var razonSocial = deserialized.FirstOrDefault(x => x.Key == "nombreCompleto").Value.ToString();
                    await _identificacionValidacionService.Update(_configuration.GetSection("tipo").Value == "1" ? drow.Field<int>("idCliente") : drow.Field<int>("idProveedor"), razonSocial, razonSocial);
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error while validation cédula" + ex.ToString());
                _ = ex.Message;
            }
        }
    }
}