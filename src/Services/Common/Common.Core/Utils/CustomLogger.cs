using System.Globalization;

namespace Common.Core.Utils;

public interface ICustomLogger
{
    void LogActivity(string message, string status = "");
}

public class CustomLogger(IConfiguration configuration) : ICustomLogger
{
    public void LogActivity(string message, string status)
    {
        try
        {
            var writeLogs = configuration.GetValue("Logs:WriteLogs", true);
            if (!writeLogs)
            {
                return; // Logs are disabled, no need to proceed
            }

            var logFolderPath = configuration.GetValue<string>("Logs:CustomLogs");
            if (string.IsNullOrEmpty(logFolderPath))
            {
                logFolderPath = Path.Combine(Environment.CurrentDirectory, "Logs");
            }

            if (!Directory.Exists(logFolderPath))
            {
                Directory.CreateDirectory(logFolderPath);
            }

            var date = DateTime.Now.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
            var logFilePath = Path.Combine(logFolderPath, $"{date}.txt");

            var logMessage = $@"
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
            using var sw = File.AppendText(filePath);
            sw.WriteLine(message);
        }
        catch (Exception ex)
        {
            // Handle exception gracefully
            _ = ex.Message;
        }
    }
}
