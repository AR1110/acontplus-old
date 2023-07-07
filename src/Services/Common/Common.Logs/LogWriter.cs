using Microsoft.Extensions.Configuration;

namespace Common.Logs
{
    public class LogWriter
    {
        private IConfiguration _config;
        private readonly string _dirLogs = "";
        public LogWriter(IConfiguration configuration)
        {
            _config = configuration;
            _dirLogs = _config.GetSection("Logs").GetSection("CustomLogs").Value;
        }
        public void LogInfo(string message)
        {
            try
            {
                string filepath = _dirLogs + "Log Info_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
                if (!Directory.Exists(_dirLogs))
                {
                    Directory.CreateDirectory(_dirLogs);
                }
                if (!File.Exists(filepath))
                {
                    using (StreamWriter sw = File.CreateText(filepath))
                    {
                        sw.WriteLine($"{DateTime.Now} - " + message);
                    }
                }
                else
                {
                    using (StreamWriter sw = File.AppendText(filepath))
                    {
                        sw.WriteLine($"{DateTime.Now} - " + message);
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
        }
        public void LogWarning(string message)
        {
            try
            {
                string filepath = _dirLogs + "Log Warning_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
                if (!Directory.Exists(_dirLogs))
                {
                    Directory.CreateDirectory(_dirLogs);
                }
                if (!File.Exists(filepath))
                {
                    using (StreamWriter sw = File.CreateText(filepath))
                    {
                        sw.WriteLine($"{DateTime.Now} - " + message);
                    }
                }
                else
                {
                    using (StreamWriter sw = File.AppendText(filepath))
                    {
                        sw.WriteLine($"{DateTime.Now} - " + message);
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
        }
        public void LogError(string message)
        {
            try
            {
                string filepath = _dirLogs + "Log Error_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
                if (!Directory.Exists(_dirLogs))
                {
                    Directory.CreateDirectory(_dirLogs);
                }
                if (!File.Exists(filepath))
                {
                    using (StreamWriter sw = File.CreateText(filepath))
                    {
                        sw.WriteLine($"{DateTime.Now} - " + message);
                    }
                }
                else
                {
                    using (StreamWriter sw = File.AppendText(filepath))
                    {
                        sw.WriteLine($"{DateTime.Now} - " + message);
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
        }
    }
}