using PrintServer.Models;
using PrintServer.Utils;
using System.Diagnostics;
using System.Management;

namespace PrintServer
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
                ManagementObjectSearcher MOS = new ManagementObjectSearcher(objScope, selectQuery);
                ManagementObjectCollection MOC = MOS.Get();
                foreach (ManagementObject mo in MOC)
                {
                    PrinterDto item = new PrinterDto();
                    item.name = mo["Name"].ToString();
                    printers.Add(item);
                }
                //json = JsonConvert.SerializeObject(printers);
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
