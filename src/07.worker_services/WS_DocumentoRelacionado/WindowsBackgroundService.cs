using Common.Logs;
using Newtonsoft.Json;
using System.Data;

namespace WS_DocRelacionado
{
    public class WindowsBackgroundService : BackgroundService
    {

        private readonly IConfiguration _configuration;
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly DocRelacionadoService _docService;

        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
             IConfiguration configuration,
             DocRelacionadoService emailService) =>
             (_logger, _configuration, _docService) = (logger, configuration, emailService);

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            LogWriter _log = new LogWriter(_configuration);

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    DataTable dt = await _docService.Get(Convert.ToInt32(_configuration.GetSection("cantDocs").Value));
                    if (!dt.Columns.Contains("code") && dt.Rows.Count > 0)
                    {
                        Parallel.ForEach(dt.AsEnumerable(), drow =>
                        {
                            ReadXml(drow);
                        });
                    }
                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);

                }
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "{Message}", ex.Message);
                _log.LogError("Error al relacionar los documentos recibidos: " + ex.ToString());
                Environment.Exit(1);
            }
        }

        public async void ReadXml(DataRow dr)
        {
            LogWriter _log = new LogWriter(_configuration);
            int idDocumento = Convert.ToInt32(dr["idDocumento"]);
            string codDoc = Convert.ToString(dr["codDoc"]) ?? "";
            string versionComp = Convert.ToString(dr["versionComp"]) ?? "";
            DataTable dt = await _docService.GetDataXml(idDocumento, codDoc, versionComp);
            if (dt.Rows.Count > 0)
            {
                string jsonResult = JsonConvert.SerializeObject(dt);
                bool result =  await _docService.Insert(idDocumento,codDoc,jsonResult);
                if (result)
                {
                    await _docService.Update(idDocumento,true);
                }
            }
            else
            {
                _log.LogWarning("Error al registrar la relacion del documento:" + idDocumento);
            }
        }
    }
}