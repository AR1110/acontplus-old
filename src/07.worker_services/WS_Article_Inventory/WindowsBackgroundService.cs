using Common.Logs;

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
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                    await Task.Delay(1000, stoppingToken);
                }
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "{Message}", ex.Message);
                _log.LogError("Error actualizando el Stock: " + ex.ToString());
                Environment.Exit(1);
            }
            
        }
    }
}