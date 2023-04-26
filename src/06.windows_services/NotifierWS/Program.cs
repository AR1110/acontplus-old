using System.ServiceProcess;

namespace NotifierWS
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main()
        {
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new Notifier()
            };
            ServiceBase.Run(ServicesToRun);
        }
    }
}
