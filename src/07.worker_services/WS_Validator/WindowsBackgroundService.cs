using BL.FactElect;
using Common.Logs;
using System.Data;
using System.Xml;

namespace WS_Validator
{
    public class WindowsBackgroundService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly ValidatorService _valService;
        private readonly WebServiceSri _sriService;
        private string _urlRecepcion = string.Empty;
        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
            IConfiguration configuration,
            ValidatorService validatorService,
            WebServiceSri serviceSri)
        {
            _logger = logger;
            _configuration = configuration;
            _valService = validatorService;
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
                    DataTable dt = await _valService.Get(Convert.ToInt32(_configuration.GetSection("cantDocs").Value));

                    if (!dt.Columns.Contains("code") && dt.Rows.Count > 0)
                    {
                        Parallel.ForEach(dt.AsEnumerable(), async drow =>
                        {
                            await SendToSri(drow);
                        });
                    }

                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error al validar los docs: " + " - " + ex.ToString());
            }

        }
        public async Task SendToSri(DataRow dataRow)
        {
            LogWriter _log = new LogWriter(_configuration);

            try
            {
                if (!string.IsNullOrEmpty(dataRow.Field<string>("xmlAcontPlus")))
                {
                    switch (dataRow.Field<string>("ambiente"))
                    {
                        case "1":
                            _urlRecepcion = _configuration.GetSection("urlRecepcionPruebas").Value;
                            break;
                        case "2":
                            _urlRecepcion = _configuration.GetSection("urlRecepcion").Value;
                            break;
                    }

                    var _response = await _sriService.Reception(dataRow.Field<string>("xmlAcontPlus"), _urlRecepcion);

                    if (_response.estado == "RECIBIDA")
                    {
                        _valService.Update(dataRow.Field<long>("idDocumentoElectronico"), 3);
                        _log.LogInfo("Doc. Validated: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                    }
                    else
                    {
                        _valService.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                        _valService.Update(dataRow.Field<long>("idDocumentoElectronico"), 5);
                        XmlDocument xmlToSend = new XmlDocument();
                        xmlToSend.LoadXml(dataRow.Field<string>("xmlAcontPlus"));
                        _log.LogWarning("Error al validar el xml en el SRI: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - Xml Sri: " + _response.xmlSri);
                    }
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error al validar el documento: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - " + ex.Message);
            }
        }
    }
}