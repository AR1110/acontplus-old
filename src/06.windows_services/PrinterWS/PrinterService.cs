using System.ServiceProcess;
using System.Configuration;
using Logs;
using System.Timers;
using System;

namespace PrinterWS
{
    public partial class PrinterService : ServiceBase
    {
        //InstallUtil.exe C:\Acontplus\WindowsServices\PrinterWS\PrinterWS.exe
        //InstallUtil.exe -u C:\Acontplus\WindowsServices\PrinterWS\PrinterWS.exe
        //private AutoResetEvent AutoEventInstance { get; set; }
        //private PrinterJob CheckPrinter { get; set; }
        //private Timer StateTimer { get; set; }
        //public int TimerInterval { get; set; }

        Timer timer = new Timer();

        private readonly string _dirLogs = "";
        private readonly int _interval = 0;
        private static object _intervalSync = new object();
        public PrinterService()
        {
            _dirLogs = ConfigurationManager.AppSettings["dirLogs"].ToString();
            _interval = Convert.ToInt16(ConfigurationManager.AppSettings["intervalo"]);
            InitializeComponent();
            //TimerInterval = 2000;
#if DEBUG
            OnStart(null);
#endif
        }
        protected override void OnStart(string[] args)
        {
            //var encryptedString = DataEncrypt.EncryptString("AcontplusTheBest", "");
            //LogWritter.LogInfo(_dirLogs, "Dev: " + encryptedString);
            //var decryptedString = DataEncrypt.DecryptString("AcontplusTheBest", "15orHggFJStXJQcdxKmB7zey8uGNzXHuauqQWdK0DuJSXf2VjmpzLdOKMIjnPzUY+ETm4CxUluRO2fvRSxM3NtrdjZ+ENlqvKO+T+EZ7uU7ZDNa08q+cfm31D09FOHqnuFPN5GcZcG7XcMM8MkvkjyTUwV2VTXDi8zH/K7V8JG3FdvIrFKg7jxGus4z4kfsG");
            //LogWritter.LogInfo(_dirLogs, "decripted: " + decryptedString);

            LogWritter.LogInfo(_dirLogs, "PrinterWS is started at");
            timer.Elapsed += new ElapsedEventHandler(Print);
            timer.Interval = _interval; //number in milisecinds  
            timer.Enabled = true;

            //AutoEventInstance = new AutoResetEvent(false);
            //CheckPrinter = new PrinterJob();
            //// Create the delegate that invokes methods for the timer.
            //TimerCallback timerDelegate = new TimerCallback(CheckPrinter.Print);

            //StateTimer = new Timer(timerDelegate, AutoEventInstance, 0, Timeout.Infinite);
            //while (StateTimer != null)
            //{
            //    //Wait until the job is done
            //    AutoEventInstance.WaitOne();
            //    //Wait for 5 minutes before starting the job again.
            //    StateTimer.Change(TimerInterval, Timeout.Infinite);
            //}
        }

        protected override void OnStop()
        {
            //StateTimer.Dispose();
            LogWritter.LogWarning(_dirLogs, "Service Printer is stopped at");
        }
        public void Print(object source, ElapsedEventArgs e)
        {
            if (System.Threading.Monitor.TryEnter(_intervalSync))
            {
                //AutoResetEvent autoEvent = (AutoResetEvent)stateInfo;
                try
                {
                    string ruc = ConfigurationManager.AppSettings["ruc"].ToString();
                    string estab = ConfigurationManager.AppSettings["estab"].ToString();
                    string idUser = ConfigurationManager.AppSettings["idUser"].ToString();
                    ApiReportParamsDto res = new ApiReportParamsDto();

                    if (!new DataPrint().Get(ruc, estab,idUser, ref res)) return;

                    LogWritter.LogInfo(ConfigurationManager.AppSettings["dirLogs"].ToString(), "Imprimiendo en: ");
                    PrintReport pr = new PrintReport();
                    string messageErr = string.Empty;
                    if (pr.DynamicPrint(res, ref messageErr))
                    {
                        //int milliseconds = 5000;
                        //Thread.Sleep(milliseconds);
                    }
                    else
                    {
                        LogWritter.LogWarning(ConfigurationManager.AppSettings["dirLogs"].ToString(), "No se pudo imprimir!");
                    }
                }
                catch (Exception ex)
                {
                    LogWritter.LogError(ConfigurationManager.AppSettings["dirLogs"].ToString(), "Error al imprimir: " + ex.Message);
                }
                finally
                {
                    System.Threading.Monitor.Exit(_intervalSync);
                }
                //autoEvent.Set();
            }
        }
        //class PrinterJob
        //{
        //    public PrinterJob() { }

        //}
    }
}
