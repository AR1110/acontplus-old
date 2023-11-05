using System.Globalization;
using Microsoft.Extensions.Configuration;

namespace Services.Common.Logs
{
    public sealed class LogWriter
    {
        private IConfiguration _configuration;
        public LogWriter(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void LogActivity(string message, string status = "")
        {
            try
            {
                string LogFolderPath = _configuration["Logs:CustomLogs"];
                if (string.IsNullOrEmpty(LogFolderPath))
                {
                    LogFolderPath = Environment.CurrentDirectory + "\\Logs\\";
                }
                if (!Directory.Exists(LogFolderPath))
                {
                    DirectoryInfo di = Directory.CreateDirectory(LogFolderPath);
                }

                string date = DateTime.Now.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
                string dateFolder = Path.Combine(LogFolderPath, date);
                LogFolderPath = dateFolder + ".txt";
                string Msg = "";
                Msg = "\n---------------------------- Start -----------------------------------\n" + Environment.NewLine;
                Msg += "Time : " + DateTime.Now.ToShortDateString().ToString() + " " + DateTime.Now.ToLongTimeString().ToString() + Environment.NewLine;
                Msg += "Status : " + status + Environment.NewLine;
                Msg += "Message : " + message + Environment.NewLine;
                Msg += "\n---------------------------- End -----------------------------------\n" + Environment.NewLine;
                Log(LogFolderPath, Msg);
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                //throw ex;
            }
        }
        public static void Log(string sFilePath, string sErrMsg)
        {
            StreamWriter sw;
            try
            {
                sw = File.AppendText(sFilePath);
                sw.WriteLine(sErrMsg);
                sw.Flush();
                sw.Close();
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                //throw ex;
            }
        }
    }
}
