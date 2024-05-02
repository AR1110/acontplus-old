using System.Globalization;
using Microsoft.Extensions.Configuration;

namespace Services.Common.Logs
{
    public interface ICustomLogger
    {
        void LogActivity(string message, string status = "");
    }

    public class CustomLogger : ICustomLogger
    {
        private readonly IConfiguration _configuration;

        public CustomLogger(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void LogActivity(string message, string status)
        {
            try
            {
                bool writeLogs = _configuration.GetValue("Logs:WriteLogs", defaultValue: true);
                if (!writeLogs)
                {
                    return; // Logs are disabled, no need to proceed
                }

                string logFolderPath = _configuration.GetValue<string>("Logs:CustomLogs");
                if (string.IsNullOrEmpty(logFolderPath))
                {
                    logFolderPath = Path.Combine(Environment.CurrentDirectory, "Logs");
                }

                if (!Directory.Exists(logFolderPath))
                {
                    Directory.CreateDirectory(logFolderPath);
                }

                string date = DateTime.Now.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
                string logFilePath = Path.Combine(logFolderPath, $"{date}.txt");

                string logMessage = $@"
---------------------------- Start -----------------------------------
Time: {DateTime.Now:yyyy-MM-dd HH:mm:ss}
Status: {status}
Message: {message}
---------------------------- End -----------------------------------";

                Log(logFilePath, logMessage);
            }
            catch (Exception ex)
            {
                // Handle exception gracefully
                _ = ex.Message;
            }
        }

        private static void Log(string filePath, string message)
        {
            try
            {
                using (StreamWriter sw = File.AppendText(filePath))
                {
                    sw.WriteLine(message);
                }
            }
            catch (Exception ex)
            {
                // Handle exception gracefully
                _ = ex.Message;
            }
        }
    }
}
