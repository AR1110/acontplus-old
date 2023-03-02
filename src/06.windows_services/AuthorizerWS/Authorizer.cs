using FactElect;
using FactElect.Dtos;
using Logs;
using System;
using System.Configuration;
using System.Data;
using System.Linq;
using System.ServiceProcess;
using System.Threading.Tasks;
using System.Timers;
using System.Xml;

namespace AuthorizerWS
{
    public partial class Authorizer : ServiceBase
    {
        Timer timer = new Timer();
        private readonly string _path = "";
        private readonly int _interval = 0;
        private string _urlAutorizacion;
        private static object _intervalSync = new object();
        public Authorizer()
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
            LogWritter.LogInfo(_path, "Service Authorizer is started at");
            timer.Elapsed += new ElapsedEventHandler(ValidatorJob);
            timer.Interval = _interval; //number in milisecinds  
            timer.Enabled = true;
        }

        protected override void OnStop()
        {
            LogWritter.LogWarning(_path, "Service Authorizer is stopped at");
        }
        private void ValidatorJob(object source, ElapsedEventArgs e)
        {
            //EJECUTAR PROCESO AUTORIZACION DE DOCUMENTOS EN SRI
            DataTable dt = new DataTable();
            if (System.Threading.Monitor.TryEnter(_intervalSync))
            {
                try
                {
                    if (!new DataAccess().Get(ref dt, Convert.ToInt32(ConfigurationManager.AppSettings["cantDocs"])))
                    {
                        return;
                    }
                    LogWritter.LogInfo(_path, "Service Authorizer is processing");
                    Parallel.ForEach(dt.AsEnumerable(), drow =>
                    {
                        Authorize(drow);
                    });
                }
                catch (Exception ex)
                {
                    LogWritter.LogError(_path, "Error al autorizar los docs: " + " - " + ex.Message + "Docs: " + HelpersNS20.DataHelperNS.DataTableToJSON(dt));
                }
                finally
                {
                    System.Threading.Monitor.Exit(_intervalSync);
                }
            }
        }

        public async void Authorize(DataRow dataRow)
        {

            try
            {
                if (!string.IsNullOrEmpty(dataRow.Field<string>("claveAcceso")))
                {
                    switch (dataRow.Field<string>("ambiente"))
                    {
                        case "1":
                            _urlAutorizacion = ConfigurationManager.AppSettings["urlAutorizacionPruebas"];
                            break;
                        case "2":
                            _urlAutorizacion = ConfigurationManager.AppSettings["urlAutorizacion"];
                            break;
                    }
                    WebServiceSri _sriService = new WebServiceSri();
                    ResponseSriDto _response = new ResponseSriDto();
                    DataAccess _dataAccess = new DataAccess();

                    _response = await _sriService.CheckExistence(dataRow.Field<string>("claveAcceso"), _urlAutorizacion);
                    if (_response.estado == "NO EXISTE")
                    {
                        _response = await _sriService.Authorization(dataRow.Field<string>("claveAcceso"), _urlAutorizacion);

                        if (_response.estado == "AUTORIZADO")
                        {
                            _dataAccess.Update(dataRow.Field<long>("idDocumentoElectronico"), _response.xmlSri, _response.fechaAutorizacion, 4);
                            LogWritter.LogInfo(_path, "Doc. Authorized: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                        }
                        else
                        {
                            _dataAccess.InsertError(dataRow.Field<long>("idDocumentoElectronico"), _response);
                            _dataAccess.Update(dataRow.Field<long>("idDocumentoElectronico"), "", "", 5);
                            XmlDocument xmlError = new XmlDocument();
                            xmlError.LoadXml(_response.ToString());

                            LogWritter.LogWarning(_path, "No se pudo autorizar el documento en el SRI   : " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - ClaveAcceso: " + dataRow.Field<string>("claveAcceso") + " - SRI Info: " + xmlError.OuterXml);
                        }
                    }
                    else if (_response.estado == "AUTORIZADO")
                    {
                        _dataAccess.Update(dataRow.Field<long>("idDocumentoElectronico"), _response.xmlSri, _response.fechaAutorizacion, 4);
                        LogWritter.LogInfo(_path, "Doc. Authorized: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")));
                    }
                }
            }
            catch (Exception ex)
            {
                //new DataAccess().Update(dataRow.Field<long>("idDocumentoElectronico"), 6);
                LogWritter.LogError(_path, "Error al autorizar el documento: " + Convert.ToString(dataRow.Field<long>("idDocumentoElectronico")) + " - " + ex.Message);
            }
        }
    }
}
