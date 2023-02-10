using ApiReports.Controllers;
using ApiReports.Dao;
using HelpersNS20;
using HelpersNS20.Dtos;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Data;

namespace ApiReports.Utils
{
    public class GenerateReport
    {
        private readonly string _dirLogs = string.Empty;
        private ReporteParametroDao _rp = new ReporteParametroDao();
        public GenerateReport()
        {
            _dirLogs = System.Configuration.ConfigurationManager.AppSettings["dirLogs"];
        }
        public byte[] ByteReport(ApiReportParamsDto data, ref string mimeType, ref string fileName)
        {
            string format = "";
            using (LocalReport lr = new LocalReport())
            {
                DataSet dsParams = new DataSet();
                if (!_rp.GetByCodeAsync(data, ref dsParams)) //OBTENEMOS PARAMETROS DINAMICOS
                    return null;

                if (dsParams.Tables.Count == 0)
                    return null;

                DataTable reportData = dsParams.Tables[0]; //Datos del reporte
                DataTable dataSources = dsParams.Tables[1]; //DataSources del reporte (Tablixs)
                DataTable rdlcParams = dsParams.Tables[2]; //Parametros del reporte reporte

                string jsonData = data.dataParams; //ENVIAMOS NUEVAMENTE LOS PARAMETROS PARA OBTENER LA INFORMACION EN EL REPORTE
                DataSet ds = new DataSet();
                foreach (DataRow row in reportData.Rows)
                {
                    ds = _rp.GetDataToReport(data.idRol, row["storedProcedure"].ToString(), jsonData);
                    if (ds.Tables.Count > 0)
                    {
                        lr.ReportPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Reports/" + row["reportPath"].ToString());
                        format = row["format"].ToString();
                        fileName = row["fileName"].ToString();
                    }
                    else
                    {
                        return null;
                    }
                }

                //Recorremos los datatbles con sus respectivas posiciones,para llenar la información
                foreach (DataRow row in dataSources.Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(), ds.Tables[Convert.ToInt32(row["position"])]));
                }
                //Recorremos los parametros del reporte como logos, textos, etc
                ReportParameter[] p = new ReportParameter[rdlcParams.Rows.Count];
                foreach (DataRow row in rdlcParams.Rows)
                {
                    if (Convert.ToBoolean(row["isByte"]))
                    {
                        p[Convert.ToInt32(row["position"])] = new ReportParameter(row["paramName"].ToString(), FileExtensionsNS.getBase64FromByte((byte[])row["paramByte"]));
                    }
                    else
                    {
                        p[Convert.ToInt32(row["position"])] = new ReportParameter(row["paramName"].ToString(), row["paramValue"].ToString());
                    }
                }
                lr.SetParameters(p);

                return lr.Render(format, null, out mimeType, out _, out _, out _, out _);
            }
        }

        public byte[] ByteReportDynamic(ApiReportParamsDto parameters, ref string mimeType, ref string fileName)
        {
            string format = "";
            string mimeTypeImg = "";
            using (LocalReport lr = new LocalReport())
            {
                CodigoBarraController _cb = new CodigoBarraController();

                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "reportPath")
                    {
                        lr.ReportPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Reports/" + item.Value.ToString());

                    }
                    if (item.Key == "format")
                    {
                        format = item.Value;
                    }
                    if (item.Key == "fileName")
                    {
                        fileName = item.Value;
                    }
                    if (item.Key == "mimeType")
                    {
                        mimeTypeImg = item.Value;
                    }
                }
                if (parameters.dataSources != null)
                {
                    foreach (var item in parameters.dataSources)
                    {
                        lr.DataSources.Add(new ReportDataSource(item.Key, DataHelperNS.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                    }
                }

                //Recorremos los parametros del reporte como logos, textos, etc
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "imagen")
                    {
                        byte[] array = Convert.FromBase64String(item.Value);
                        lr.SetParameters(new ReportParameter("logo", FileExtensionsNS.getBase64FromByte((byte[])array)));
                        lr.SetParameters(new ReportParameter("mimeType", mimeTypeImg));
                    }
                    //if (item.Key == "mimeType")
                    //{                        
                    //    lr.SetParameters(new ReportParameter(item.Key, item.Value));
                    //}
                    if (item.Key == "claveAcceso")
                    {
                        byte[] barcode = _cb.Get(item.Value);
                        lr.SetParameters(new ReportParameter("barcode", FileExtensionsNS.getBase64FromByte((byte[])barcode)));
                        lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                    }
                }
                return lr.Render(format, null, out mimeType, out _, out _, out _, out _);
            }
        }
    }
}