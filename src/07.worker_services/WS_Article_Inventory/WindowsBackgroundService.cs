using Common.Logs;
using Domain.Models.Almacen;
using Newtonsoft.Json;
using System.Data;

namespace WS_Article_Inventory
{
    public class WindowsBackgroundService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly InventoryService _inventService;


        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
           IConfiguration configuration,
           InventoryService inventService) =>
           (_logger, _configuration, _inventService) = (logger, configuration, inventService);

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            LogWriter _log = new LogWriter(_configuration);

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    DataTable dt = await _inventService.Get(Convert.ToInt32(_configuration.GetSection("cantArticles").Value));
                    if (!dt.Columns.Contains("code") && dt.Rows.Count > 0)
                    {
                        Parallel.ForEach(dt.AsEnumerable(), drow =>
                        {
                            DocumentInventory(drow);
                        });
                    }
                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);
                }
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "{Message}", ex.Message);
                _log.LogError("Error actualizando el Stock: " + ex.ToString());
                Environment.Exit(1);
            }

        }

        public async void DocumentInventory(DataRow dr)
        {
            LogWriter _log = new LogWriter(_configuration);
            int idArticulo = (Convert.ToInt32(dr["idArticulo"]));
            int idControlStock = (Convert.ToInt32(dr["idControlStock"]));
            DataTable dt = await _inventService.GetDocument(idArticulo);
            if (dt.Rows.Count > 0)
            {
                DataRow lastRow = dt.Rows[dt.Rows.Count - 1];
                decimal stock = Convert.ToDecimal(lastRow["saldo"]);
                await _inventService.Update(idControlStock, idArticulo, stock);
            }
            else
            {
                _log.LogWarning("Error al traer los documentos con el  articulo id :" + idArticulo);

            }
        }

    }
}