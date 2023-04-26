using System;
using System.IO;

namespace Logs
{
    public static class LogWritter
    {
        public static void LogInfo(string path, string message)
        {
            try
            {
                string filepath = path + "Log Info_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
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
        public static void LogWarning(string path, string message)
        {
            try
            {
                string filepath = path + "Log Warning_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
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
        public static void LogError(string path, string message)
        {
            try
            {
                string filepath = path + "Log Error_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
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