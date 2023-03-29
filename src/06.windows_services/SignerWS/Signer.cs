using System.ServiceProcess;
using System.Timers;
using System.Configuration;
using Logs;
using System.Data;
using System.Threading.Tasks;
using System;
using System.Security.Cryptography.X509Certificates;

namespace SignerWS
{
    public partial class Signer : ServiceBase
    {
        //https://www.c-sharpcorner.com/article/create-windows-services-in-c-sharp/
        //InstallUtil.exe C:\Users\Ivan\Source\Workspaces\AcontPlusDev\src\WindowsServices\SignerWS\bin\Release\SignerWS.exe
        //InstallUtil.exe -u C:\Users\Ivan\Source\Workspaces\AcontPlusDev\src\WindowsServices\SignerWS\bin\Release\SignerWS.exe
        Timer timer = new Timer();
        private readonly string _path = "";
        private readonly string _dirCertificates = "";
        private readonly int _interval = 0;
        private static object _intervalSync = new object();

        public Signer()
        {
            _path = ConfigurationManager.AppSettings["dirLogs"].ToString();
            _dirCertificates = ConfigurationManager.AppSettings["dirCertificates"].ToString();
            _interval = Convert.ToInt32(ConfigurationManager.AppSettings["intervalo"]);
            InitializeComponent();
#if DEBUG

            OnStart(null);
#endif
        }

        protected override void OnStart(string[] args)
        {
            LogWritter.LogInfo(_path, "Service Signer is started at");
            timer.Elapsed += new ElapsedEventHandler(SignerJob);
            timer.Interval = _interval; //number in milisecinds  
            timer.Enabled = true;
        }

        protected override void OnStop()
        {
            LogWritter.LogWarning(_path, "Service Signer is stopped at");
        }
        private void SignerJob(object source, ElapsedEventArgs e)
        {
            //EJECUTAR PROCESO FIRMA DOCUMENTOS
            DataTable dt = new DataTable();
            if (System.Threading.Monitor.TryEnter(_intervalSync))
            {
                try
                {
                    if (!new DataAccess().Get(ref dt, Convert.ToInt32(ConfigurationManager.AppSettings["cantDocs"])))
                    {
                        return;
                    }
                    //LogWritter.LogInfo(_path, "Service Signer is processing");

                    Parallel.ForEach(dt.AsEnumerable(), drow =>
                    {
                        SignXml(drow);
                    });
                }
                catch (Exception ex)
                {
                    LogWritter.LogError(_path, "Error al firmar los docs: " + " - " + ex.Message + "Docs: " + DataHelperNS.DataTableToJSON(dt));
                }
                finally
                {
                    System.Threading.Monitor.Exit(_intervalSync);
                }
            }
        }
        public void SignXml(DataRow dataRow)
        {
            DataAccess _dataAccess = new DataAccess();
            DataSet ds = new DataSet();
            try
            {
                if (!_dataAccess.GetInfoDoc(ref ds, dataRow.Field<long>("idDocumentoElectronico"))) { return; }
                ComprobanteXml _comp = new ComprobanteXml();
                string xmlToSign = string.Empty;
                string xmlSigned = string.Empty;
                if (_comp.Create(dataRow.Field<string>("codDoc"), ds, ref xmlToSign))
                {
                    //string nameCert = "";
                    //string password = "";
                    //X509Certificate2 cert = new X509Certificate2(_dirCertificates + nameCert, password, X509KeyStorageFlags.Exportable | X509KeyStorageFlags.PersistKeySet);

                    X509Certificate2 cert = new X509Certificate2(_dirCertificates + dataRow.Field<string>("certificate"), dataRow.Field<string>("password"), X509KeyStorageFlags.Exportable | X509KeyStorageFlags.PersistKeySet);
                    // Get the value.
                    string expirationDate = cert.GetExpirationDateString();

                    //DateTime expDate = Convert.ToDateTime("03/03/2024 3:39:09 PM");
                    int result = DateTime.Compare(DateTime.Now, Convert.ToDateTime(expirationDate));
                    if (result > 0)
                    {
                        _dataAccess.UpdateError(dataRow.Field<long>("idDocumentoElectronico"), 0, "Firma Electrónica caducada");
                        LogWritter.LogWarning(_path, "Firma Electrónica caducada: " + dataRow.Field<string>("certificate"));
                    }
                    else
                    {
                        if (new SignDocument().Sign(xmlToSign, _dirCertificates + dataRow.Field<string>("certificate"), dataRow.Field<string>("password"), ref xmlSigned))
                        {
                            _dataAccess.Update(dataRow.Field<long>("idDocumentoElectronico"), xmlSigned, 2);
                            LogWritter.LogInfo(_path, "Doc. Signed: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                        }
                        else
                        {
                            _dataAccess.UpdateError(dataRow.Field<long>("idDocumentoElectronico"), 0, "Error al firmar el xml del comprobante");
                            LogWritter.LogWarning(_path, "Error al firmar el xml del comprobante: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + "- Data Doc: " + DataHelperNS.DataSetToJSON(ds));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _dataAccess.UpdateError(dataRow.Field<long>("idDocumentoElectronico"), 0, Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - " + ex.Message);
                LogWritter.LogError(_path, "Error al crear el xml del comprobante: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - " + ex.Message + "- Data Doc: " + DataHelperNS.DataSetToJSON(ds));
            }
        }
    }
}
