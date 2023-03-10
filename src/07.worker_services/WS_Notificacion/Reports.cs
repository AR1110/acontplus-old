using DataAccess;
using Microsoft.Reporting.NETCore;
using System.Data;

namespace WS_Notificacion
{
    public sealed class Reports
    {
        private readonly IConfiguration _config;
        public Reports(IConfiguration config)
        {
            _config = config;
        }
        public async Task<byte[]> Create(DataSet dsParams, string spParams)
        {
            using (LocalReport report = new LocalReport())
            {
                if (dsParams.Tables.Count == 0 || dsParams.Tables[0].Rows.Count == 0)
                    return null;

                DbAccess _db = new DbAccess(_config);
                await _db.SPExecute(dsParams.Tables[0].Rows[0]["storedProcedure"].ToString());
                _db.AddDynamicParam("json", spParams);
                DataSet ds = _db.GetDataSet();

                if (ds.Tables.Count > 0)
                {
                    report.ReportPath = _config.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0]["reportPath"].ToString();
                }
                else
                {
                    return null;
                }
                foreach (DataRow row in dsParams.Tables[1].Rows)
                {
                    report.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(), ds.Tables[Convert.ToInt32(row["position"])]));
                }
                if (dsParams.Tables[2].Rows.Count > 0)
                {
                     foreach (DataRow item in dsParams.Tables[2].Rows)
                    {
                        if (Convert.ToBoolean(item["isByte"]))
                        {
                            report.SetParameters(new[] { new ReportParameter(item["paramName"].ToString(), Helpers.FileExtensions.GetBase64FromByte((byte[])item["paramByte"])) });
                        }
                        else
                        {
                            report.SetParameters(new[] { new ReportParameter(item["paramName"].ToString(), item["paramValue"].ToString()) });
                        }
                    }
                }
                return report.Render(dsParams.Tables[0].Rows[0]["format"].ToString());
            }
        }
    }
}
