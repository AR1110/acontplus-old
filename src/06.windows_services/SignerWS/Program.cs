using System.ServiceProcess;

namespace SignerWS
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
                new Signer()
            };
            ServiceBase.Run(ServicesToRun);
        }
    }
}
