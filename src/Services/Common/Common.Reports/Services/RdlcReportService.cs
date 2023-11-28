using System.Data;
using System.Text;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Reports.Enums;
using Common.Reports.Models;
using Microsoft.Reporting.NETCore;

namespace Common.Reports.Services
{
    public class RdlcReportService : IRdlcReportService
    {
        public byte[] GetCustomReport(DataSet dsParams, DataSet ds)
        {
            DataTable reportParams = dsParams.Tables[0];
            DataTable dataSources = dsParams.Tables[1];
            DataTable rdlcParams = dsParams.Tables[2];
            using (var lr = new LocalReport())
            {
                var mainPath = Directory.GetCurrentDirectory() + "\\Reports\\";

                //lr.ReportPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, dsParams.Tables[0].Rows[0]["reportPath"].ToString());
                var reportPath = reportParams.Rows[0].Field<string>("reportPath");
                bool hasParams = Convert.ToBoolean(reportParams.Rows[0]["hasParams"]);
                var format = reportParams.Rows[0].Field<string>("format");

                var paths = reportPath.Split("/");
                paths = paths.Where(s => !string.IsNullOrEmpty(s)).ToArray();

                switch (paths.Length)
                {
                    case 1:
                        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(mainPath, paths[0])));
                        break;
                    case 2:
                        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(mainPath, paths[0], paths[1])));
                        break;
                    default:
                        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(mainPath + reportPath));
                        break;
                }
                //Recorremos los datatbles con sus respectivas posiciones,para llenar la información
                foreach (DataRow row in dataSources.Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(), ds.Tables[row.Field<int>("position")]));
                }
                //Recorremos los parametros del reporte como logos, textos, etc
                if (hasParams)
                {
                    DataTable firstDataSource = ds.Tables[0];
                    if (firstDataSource.Columns.Contains("codigoAutorizacion"))
                    {
                        lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(BarcodeGen.Create(firstDataSource.Rows[0].Field<string>("codigoAutorizacion")), 0, BarcodeGen.Create(firstDataSource.Rows[0].Field<string>("codigoAutorizacion")).Length)));
                        lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                    }
                    //Recorremos los parametros del reporte como logos, textos, etc
                    if (rdlcParams.Rows.Count > 0)
                    {
                        foreach (DataRow item in rdlcParams.Rows)
                        {
                            if (Convert.ToBoolean(item["isByte"]))
                            {
                                lr.SetParameters(new[] { new ReportParameter(item["paramName"].ToString(), FileExtensions.GetBase64FromByte((byte[])item["paramByte"])) });
                            }
                            else
                            {
                                lr.SetParameters(new[] { new ReportParameter(item["paramName"].ToString(), item["paramValue"].ToString()) });
                            }
                        }
                    }
                }

                return lr.Render(format, null, out _, out _, out _, out _, out _);
            }
        }
        public ReportResponse GetDynamicReport(DataSet ds)
        {
            if (!ds.Tables.Contains("RdlcProps") | !ds.Tables.Contains("RdlcDataSources"))
            {
                return null;
            }

            if (ds.Tables["RdlcProps"].Rows.Count == 0 | ds.Tables["RdlcDataSources"].Rows.Count == 0)
            {
                return null;
            }

            using (LocalReport lr = new LocalReport())
            {
                var rdlcProps = DataTableMapper.BindData<RdlcProps>(ds.Tables["RdlcProps"]);
                string path = Path.Combine(Directory.GetCurrentDirectory(), rdlcProps.ReportPath);
                lr.ReportPath = path;

                foreach (DataRow item in ds.Tables["RdlcDataSources"].Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(item.Field<string>("dsName"), ds.Tables[item.Field<string>("dsName")]));
                }

                if (ds.Tables.Contains("RdlcParams") && ds.Tables["RdlcParams"].Rows.Count > 0)
                {
                    foreach (DataRow item in ds.Tables["RdlcParams"].Rows)
                    {
                        if (Convert.ToBoolean(item.Field<bool>("isBase64")))
                        {
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), FileExtensions.GetBase64FromByte(item.Field<byte[]>("paramValue"))) });
                        }
                        else
                        {
                            var paramValue = Encoding.UTF8.GetString(item.Field<byte[]>("paramValue"));
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), paramValue) });
                        }
                    }
                }
                byte[] fileReport = lr.Render(rdlcProps.ReportFormat, null, out _, out _, out _, out _, out _);
                Enum.TryParse(rdlcProps.ReportFormat, out FileFormats.FileContentType fc);
                Enum.TryParse(rdlcProps.ReportFormat, out FileFormats.FileExtension fe);
                return new ReportResponse { FileContents = fileReport, ContentType = EnumExtensions.DisplayName(fc), FileDownloadName = rdlcProps.ReportName + EnumExtensions.DisplayName(fe) };
            }
        }
        public async Task<ReportResponse> GetErrorAsync()
        {
            string errorFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "NotFound.pdf");
            byte[] bytes = await File.ReadAllBytesAsync(errorFilePath);
            return new ReportResponse { FileContents = bytes, ContentType = "application/pdf", FileDownloadName = "Not Found.pdf" };
        }
    }
}
