using System.ComponentModel;
using System.Configuration.Install;

namespace SignerWS
{
    [RunInstaller(true)]
    public partial class SignerInstaller : System.Configuration.Install.Installer
    {
        public SignerInstaller()
        {
            InitializeComponent();
        }

        private void serviceProcessInstaller1_AfterInstall(object sender, InstallEventArgs e)
        {

        }
    }
}
