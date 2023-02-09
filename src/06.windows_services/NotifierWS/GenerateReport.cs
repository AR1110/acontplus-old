using HelpersNS20;
using HelpersNS20.Dtos;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace NotifierWS
{
    public class GenerateReport
    {
        public readonly string _dirReports = "";
        public GenerateReport()
        {
            _dirReports = ConfigurationManager.AppSettings["dirReports"].ToString();
        }
        public byte[] ByteReportDynamic(ApiReportParamsDto parameters, ref string mimeType, ref string fileName)
        {
            string format = "";

            using (LocalReport lr = new LocalReport())
            {
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "reportPath")
                    {
                        //lr.ReportPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Reports/" + item.Value.ToString());
                        lr.ReportPath = _dirReports + item.Value.ToString();
                    }
                    if (item.Key == "format")
                    {
                        format = item.Value;
                    }
                    if (item.Key == "fileName")
                    {
                        fileName = item.Value;
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
                        lr.SetParameters(new ReportParameter("mimeType", "image/png"));
                    }
                    //if (item.Key == "mimeType")
                    //{                        
                    //    lr.SetParameters(new ReportParameter(item.Key, item.Value));
                    //}
                    if (item.Key == "claveAcceso")
                    {

                        byte[] barcode = DrawBarcode(item.Value);
                        lr.SetParameters(new ReportParameter("barcode", FileExtensionsNS.getBase64FromByte((byte[])barcode)));
                        lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                    }
                }
                byte[] reportBytes = lr.Render(format, null, out mimeType, out _, out _, out _, out _);
                return reportBytes;
            }
        }

        public byte[] DrawBarcode(String text)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                Image codigoBarras;
                BarcodeLib.Barcode Codigo = new BarcodeLib.Barcode();
                Codigo.IncludeLabel = false;
                codigoBarras = Codigo.Encode(BarcodeLib.TYPE.CODE128, text, Color.Black, Color.White, 1000, 100);
                codigoBarras.Save(memoryStream, ImageFormat.Png);
                memoryStream.Position = 0;
                if (codigoBarras != null)
                {
                    codigoBarras.Dispose();
                }
                return memoryStream.ToArray();

            }
        }
    }
}