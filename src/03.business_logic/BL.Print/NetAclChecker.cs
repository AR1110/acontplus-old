using System.ComponentModel;
using System.Diagnostics;
using System.Reflection;
using System.Security.Principal;
using static System.Net.Mime.MediaTypeNames;

namespace BL.Print
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
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            psi.WindowStyle = ProcessWindowStyle.Hidden;
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
        public static void RunProcessAsAdmin()
        {
            //https://systemoutofmemory.com/blogs/the-programmer-blog/c-force-net-application-to-run-as-administrator
            try
            {
                if (!IsRunAsAdmin())
                {
                    //System.Diagnostics.ProcessStartInfo startInfo = new ProcessStartInfo();
                    //startInfo.UseShellExecute = false;
                    //startInfo.CreateNoWindow = true;
                    //startInfo.WindowStyle = ProcessWindowStyle.Hidden;
                    //startInfo.RedirectStandardOutput = true;
                    //startInfo.WorkingDirectory = AppDomain.CurrentDomain.BaseDirectory;
                    //startInfo.FileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "PrintServer.exe");
                    //startInfo.Verb = "runas";
                    ////MLHIDE
                    ////startInfo.Arguments = parameters;
                    //startInfo.ErrorDialog = true;

                    //Process process = System.Diagnostics.Process.Start(startInfo);
                    //process.WaitForExit();
                    //return process.ExitCode;

                    ProcessStartInfo proc = new ProcessStartInfo();
                    proc.UseShellExecute = true;
                    proc.WorkingDirectory = Environment.CurrentDirectory;
                    proc.FileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Acontplus Print.exe");

                    proc.Verb = "runas";

                    try
                    {
                        Process.Start(proc).WaitForExit();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("This program must be run as an administrator! \n\n" + ex.ToString());
                    }
                }
                else
                {
                }
            }
            catch (Win32Exception ex)
            {
                _ = ex.Message;

            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
        }
        private static bool IsRunAsAdmin()
        {
            WindowsIdentity id = WindowsIdentity.GetCurrent();
            WindowsPrincipal principal = new WindowsPrincipal(id);

            return principal.IsInRole(WindowsBuiltInRole.Administrator);
        }
    }
}
