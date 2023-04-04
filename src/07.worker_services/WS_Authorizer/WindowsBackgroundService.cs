using BL.FactElect;
using Common.Logs;
using Helpers;
using System.Data;
using System.Xml;

namespace WS_Authorizer
{
    public class WindowsBackgroundService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly AuthorizerService _authService;
        private readonly WebServiceSri _sriService;
        private string _urlAutorizacion = string.Empty;
        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
            IConfiguration configuration,
            AuthorizerService authService,
            WebServiceSri serviceSri)
        {
            _logger = logger;
            _configuration = configuration;
            _authService = authService;
            _sriService = serviceSri;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    //_logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                    DataTable dt = await _authService.Get(Convert.ToInt32(_configuration.GetSection("cantDocs").Value));
                    if (!dt.Columns.Contains("code") && dt.Rows.Count > 0)
                    {
                        Parallel.ForEach(dt.AsEnumerable(), async drow =>
                        {
                            await Authorize(drow);
                        });
                    }
                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error al autorizar los docs: " + " - " + ex.ToString());
            }

        }
        public async Task Authorize(DataRow dataRow)
        {
            LogWriter _log = new LogWriter(_configuration);

            try
            {
                if (!string.IsNullOrEmpty(dataRow.Field<string>("claveAcceso")))
                {
                    switch (dataRow.Field<string>("ambiente"))
                    {
                        case "1":
                            _urlAutorizacion = _configuration.GetSection("urlAutorizacionPruebas").Value;
                            break;
                        case "2":
                            _urlAutorizacion = _configuration.GetSection("urlAutorizacion").Value;
                            break;
                    }
                    //if (await HttpCLientHelper.HasAccessToEndpoint(_urlAutorizacion))
                    //{
                        var _response = await _sriService.CheckExistence(dataRow.Field<string>("claveAcceso"), _urlAutorizacion);
                        if (_response.estado == "NO EXISTE")
                        {
                            _response = await _sriService.Authorization(dataRow.Field<string>("claveAcceso"), _urlAutorizacion);

                            if (_response.estado == "AUTORIZADO")
                            {
                                _authService.Update(dataRow.Field<long>("idDocumentoElectronico"), _response.xmlSri, _response.fechaAutorizacion, 4);
                                _log.LogInfo("Doc. Authorized: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                            }
                            else
                            {
                                _authService.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                                _authService.Update(dataRow.Field<long>("idDocumentoElectronico"), "", "", 5); 

                                _log.LogWarning("No se pudo autorizar el documento en el SRI   : " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - ClaveAcceso: " + dataRow.Field<string>("claveAcceso") + " - SRI Info: " + _response.xmlSri ?? "");
                            }
                        }
                        if (_response.estado == "AUTORIZADO")
                        {
                            _authService.Update(dataRow.Field<long>("idDocumentoElectronico"), _response.xmlSri, _response.fechaAutorizacion, 4);
                            _log.LogInfo("Doc. Authorized: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                        }
                        if (_response.estado == "NO AUTORIZADO")
                        {
                            _authService.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                            _authService.Update(dataRow.Field<long>("idDocumentoElectronico"), "", "", 5);
                            _log.LogWarning("No se pudo autorizar el documento en el SRI   : " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - ClaveAcceso: " + dataRow.Field<string>("claveAcceso"));
                        }
                        if (_response.estado == "ERROR")
                        {
                            _log.LogError("IdDoc --> " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - ClaveAcceso: " + dataRow.Field<string>("claveAcceso") + "\n" + _response.message);
                            _authService.Update(dataRow.Field<long>("idDocumentoElectronico"), "", "", 3);
                        }
                    }
                //}
            }
            catch (Exception ex)
            {
                _log.LogError("Error al autorizar el documento: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - " + ex.ToString());
            }
        }

    }
}