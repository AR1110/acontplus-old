using Domain.Dtos;
using Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Reporting.NETCore;
using Newtonsoft.Json;
using System.Data;

namespace BL.Reports
{
    public sealed class Reports
    {
        private readonly IConfiguration _configuration;
        public Reports(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public byte[] ByteReport(DataSet dsParams, DataSet ds)
        {
            using (LocalReport lr = new LocalReport())
            {
                if (dsParams.Tables[0].Rows.Count == 0)
                    return null;

                if (ds.Tables[0].Rows.Count > 0)
                {
                    lr.ReportPath = _configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0]["reportPath"].ToString();
                }
                else
                {
                    return null;
                }
                //Recorremos los datatbles con sus respectivas posiciones,para llenar la información
                foreach (DataRow row in dsParams.Tables[1].Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(), ds.Tables[Convert.ToInt32(row["position"])]));
                }
                //Recorremos los parametros del reporte como logos, textos, etc
                if (Convert.ToBoolean(dsParams.Tables[0].Rows[0]["hasParams"]))
                {
                    //Recorremos los parametros del reporte como logos, textos, etc
                    ReportParameter[] p = new ReportParameter[dsParams.Tables[2].Rows.Count];
                    foreach (DataRow row in dsParams.Tables[2].Rows)
                    {
                        if (Convert.ToBoolean(row["isByte"]))
                        {
                            p[Convert.ToInt32(row["position"])] = new ReportParameter(row["paramName"].ToString(), FileExtensions.GetBase64FromByte((byte[])row["paramByte"]));
                        }
                        else
                        {
                            p[Convert.ToInt32(row["position"])] = new ReportParameter(row["paramName"].ToString(), row["paramValue"].ToString());
                        }
                    }
                    lr.SetParameters(p);
                }

                return lr.Render(dsParams.Tables[0].Rows[0]["format"].ToString(), null, out _, out _, out _, out _, out _);
            }
        }

        public byte[] ByteReportDynamic(ApiReportParamsDto parameters, ref string mimeType, ref string fileName)
        {
            string format = "";
            string mimeTypeImg = "";
            using (LocalReport lr = new LocalReport())
            {
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "reportPath")
                    {
                        lr.ReportPath = _configuration.GetSection("dirReports").Value + item.Value.ToString();

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
                        lr.DataSources.Add(new ReportDataSource(item.Key, DataHelper.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                    }
                }

                //Recorremos los parametros del reporte como logos, textos, etc
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "imagen")
                    {
                        byte[] array = Convert.FromBase64String(item.Value);
                        lr.SetParameters(new ReportParameter("logo", FileExtensions.GetBase64FromByte((byte[])array)));
                        lr.SetParameters(new ReportParameter("mimeType", mimeTypeImg));
                    }
                    //if (item.Key == "mimeType")
                    //{                        
                    //    lr.SetParameters(new ReportParameter(item.Key, item.Value));
                    //}
                    if (item.Key == "claveAcceso")
                    {
                        lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(BarcodeGen.Create(item.Value), 0, BarcodeGen.Create(item.Value).Length)));
                        lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                    }
                }
                return lr.Render(format, null, out mimeType, out _, out _, out _, out _);
            }
        }
    }

}