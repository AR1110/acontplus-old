using BL.FactElect;
using Common.Logs;
using Domain.FactElect;
using System.Data;

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
            ResponseSriDto _response = new ResponseSriDto();
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
                    //if (await HttpCLientHelper.HasAccessToEndpoint(_urlRecepcion))
                    //{
                    _response = await _sriService.Reception(dataRow.Field<string>("xmlAcontPlus"), _urlRecepcion);

                    switch (_response.estado)
                    {
                        case "RECIBIDA":
                            _valService.Update(dataRow.Field<long>("idDocumentoElectronico"), 3);
                            _log.LogInfo("Doc. Validated: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                            break;
                        case "DEVUELTA":
                            int codEstado = 5;
                            if (_response.identificador == "43")
                            {
                                codEstado = 3;
                                _log.LogInfo("Doc. Validated: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                            }
                            else
                            {
                                _log.LogWarning("Error al validar el xml en el SRI: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - Xml Sri: " + _response.xmlSri);
                                _valService.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                            }
                            _valService.Update(dataRow.Field<long>("idDocumentoElectronico"), codEstado);
                            break;
                        default:
                            if (dataRow.Field<int>("codEstado") == 2)
                            {
                                _response.estado = "SRIOFFLINE";
                                _response.message = "SRI NO ESTA EN LINEA";
                                _valService.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                                _valService.Update(dataRow.Field<long>("idDocumentoElectronico"), 7);
                            }
                            break;
                    }
                    //}
                    //else
                    //{
                    //    if (dataRow.Field<int>("codEstado") == 2)
                    //    {
                    //        _response.estado = "SRIOFFLINE";
                    //        _response.message = "SRI NO ESTA EN LINEA";
                    //        _valService.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                    //        _valService.Update(dataRow.Field<long>("idDocumentoElectronico"), 7);
                    //    }
                    //}
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error al validar el documento: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - " + ex.Message);
            }
        }
    }
}