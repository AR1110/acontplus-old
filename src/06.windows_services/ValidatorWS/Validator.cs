using System.Configuration;
using System;
using System.ServiceProcess;
using Logs;
using System.Data;
using System.Timers;
using System.Threading.Tasks;
using FactElect;
using FactElect.Dtos;
using System.Xml;

namespace ValidatorWS
{
    public partial class Validator : ServiceBase
    {
        Timer timer = new Timer();
        private readonly string _path = "";
        private readonly int _interval = 0;
        private string _urlRecepcion;
        private static object _intervalSync = new object();
        public Validator()
        {
            _path = ConfigurationManager.AppSettings["dirLogs"].ToString();
            _interval = Convert.ToInt32(ConfigurationManager.AppSettings["intervalo"]);
            InitializeComponent();
#if DEBUG

            OnStart(null);
#endif
        }

        protected override void OnStart(string[] args)
        {
            LogWritter.LogInfo(_path, "Service Validator is started at");
            timer.Elapsed += new ElapsedEventHandler(ValidatorJob);
            timer.Interval = _interval; //number in milisecinds  
            timer.Enabled = true;
        }

        protected override void OnStop()
        {
            LogWritter.LogWarning(_path, "Service Validator is stopped at");
        }
        private void ValidatorJob(object source, ElapsedEventArgs e)
        {
            //EJECUTAR PROCESO VALIDACIÓN DE DOCUMENTOS EN SRI
            DataTable dt = new DataTable();
            if (System.Threading.Monitor.TryEnter(_intervalSync))
            {
                try
                {
                    if (!new DataAccess().Get(ref dt, Convert.ToInt32(ConfigurationManager.AppSettings["cantDocs"])))
                    {
                        return;
                    }
                    //LogWritter.LogInfo(_path, "Service Validator is processing");
                    Parallel.ForEach(dt.AsEnumerable(), drow =>
                    {
                        SendToSri(drow);
                    });
                }
                catch (Exception ex)
                {
                    LogWritter.LogError(_path, "Error al validar los docs: "  + " - " + ex.Message + "Docs: " + HelpersNS20.DataHelperNS.DataTableToJSON(dt));
                }
                finally
                {
                    System.Threading.Monitor.Exit(_intervalSync);
                }
            }
        }

        public async void SendToSri(DataRow dataRow)
        {

            try
            {
                if (!string.IsNullOrEmpty(dataRow.Field<string>("xmlAcontPlus")))
                {
                    switch (dataRow.Field<string>("ambiente"))
                    {
                        case "1":
                            _urlRecepcion = ConfigurationManager.AppSettings["urlRecepcionPruebas"];
                            break;
                        case "2":
                            _urlRecepcion = ConfigurationManager.AppSettings["urlRecepcion"];
                            //_urlAutorizacion = ConfigurationManager.AppSettings["urlAutorizacion"];
                            break;
                    }
                    WebServiceSri serviceSri = new WebServiceSri();

                    ResponseSriDto _response = await serviceSri.Reception(dataRow.Field<string>("xmlAcontPlus"), _urlRecepcion);
                    DataAccess _dataAccess = new DataAccess();

                    if (_response.estado == "RECIBIDA")
                    {
                        _dataAccess.Update(dataRow.Field<long>("idDocumentoElectronico"), 3);
                        LogWritter.LogInfo(_path, "Doc. Validated: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                    }
                    else
                    {
                        _dataAccess.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                        _dataAccess.Update(dataRow.Field<long>("idDocumentoElectronico"), 5);
                        XmlDocument xmlToSend = new XmlDocument();
                        xmlToSend.LoadXml(dataRow.Field<string>("xmlAcontPlus"));
                        LogWritter.LogWarning(_path, "Error al validar el xml en el SRI: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - Xml Sri: " + _response.xmlSri);
                    }
                }
            }
            catch (Exception ex)
            {
                //new DataAccess().Update(dataRow.Field<long>("idDocumentoElectronico"), 6);
                LogWritter.LogError(_path, "Error al validar el documento: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - " + ex.Message);
            }
        }
    }
}
