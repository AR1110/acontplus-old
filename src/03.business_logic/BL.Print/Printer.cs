using Common.Logs;
using Domain.Config.Dtos;
using System.Diagnostics;
using System.Management;

namespace BL.Print
{
    public class Printer
    {
        public void Get(ref List<PrinterDto> printers)
        {
            printers = new List<PrinterDto>();
            try
            {
                ManagementScope objScope = new ManagementScope(ManagementPath.DefaultPath); //For the local Access
                objScope.Connect();

                SelectQuery selectQuery = new SelectQuery();
                selectQuery.QueryString = "Select * from win32_Printer";
                using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(objScope, selectQuery))
                {
                    foreach (ManagementObject printer in searcher.Get())
                    {
                        PrinterDto item = new PrinterDto();
                        item.name = printer["Name"].ToString();
                        item.driverName = printer["DriverName"].ToString();
                        item.isDefault = Convert.ToBoolean(printer["Default"]);
                        item.machine = Environment.MachineName;
                        printers.Add(item);
                    }
                }

            }
            catch (Exception ex)
            {
                var appLog = new EventLog("Application");
                var eventSource = "PrintServer";
                appLog.Source = EventsLogs.CreateEventSource(eventSource);
                appLog.WriteEntry("Server Exception: " + ex.ToString(), EventLogEntryType.Error);
                Console.WriteLine("Error in server {0}", ex.Message);
            }

        }
    }
}
