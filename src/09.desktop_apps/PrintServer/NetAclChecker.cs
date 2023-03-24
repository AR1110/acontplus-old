using System.Diagnostics;

namespace PrintServer
{
    public static class NetAclChecker
    {
        public static void AddAddress(string address)
        {
            AddAddress(address, Environment.UserDomainName, Environment.UserName);
        }

        public static void AddAddress(string address, string domain, string user)
        {
            //string args = string.Format(@"http add urlacl url={0} user={1}\{2}", address, domain, user);
            string args = string.Format(@"http add urlacl url={0} user={1}\{2} listen=yes", address, domain, user);

            ProcessStartInfo psi = new ProcessStartInfo("netsh", args);
            psi.CreateNoWindow = true;
            psi.WindowStyle = ProcessWindowStyle.Hidden;
            psi.UseShellExecute = false;
            psi.RedirectStandardOutput = true;
            psi.Verb = "runas";

            Process.Start(psi).WaitForExit();

            //Process p = new Process();
            //p.StartInfo.FileName = "netsh";
            //p.StartInfo.Arguments = args;
            //p.StartInfo.UseShellExecute = false;
            //p.StartInfo.CreateNoWindow = true;
            //p.StartInfo.RedirectStandardOutput = true;
            //p.StartInfo.Verb = "runas";
            //p.Start();
            //p.WaitForExit();
        }
    }
}
