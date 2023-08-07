using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;
using System.Data;
using Vet.Core.Interfaces;
using Vet.Core.Utils;
using Vet.Infrastructure.Data;

namespace Vet.Application.Reports
{
    public class MedicalHistoryReport : IMedicalHistoryReport
    {
        private readonly VetContext _context;
        public MedicalHistoryReport(VetContext context)
        {
            _context = context;
        }
        public async Task<byte[]> GetAsync(int id)
        {
            byte[] data = null;
            DataSet ds = null;
            string query = @"SELECT * FROM Pet.MedicalHistory WHERE Id = @id
        SELECT * FROM Pet.HealthCheck WHERE MedicalHistoryId = @id
        SELECT * FROM Pet.BehaviorTest WHERE MedicalHistoryId = @id";
            //using (var context = new SampleContext())
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "Pet.MedicalHistory_Report";
                SqlParameter paramId = new SqlParameter("id", SqlDbType.Int);
                paramId.Value = id;
                command.Parameters.Add(paramId);
                command.CommandType = CommandType.StoredProcedure;
                await _context.Database.OpenConnectionAsync();
                using (SqlDataAdapter adapter = new SqlDataAdapter())
                {
                    adapter.SelectCommand = (SqlCommand)command;

                    ds = new DataSet();
                    adapter.Fill(ds);
                }
            }

            using (LocalReport lr = new LocalReport())
            {

                if (ds.Tables[0].Rows.Count > 0)
                {
                    var path = System.IO.Directory.GetCurrentDirectory() + "\\Reports\\" + "MedicalHistory.rdl";
                    lr.ReportPath = path;
                    //lr.ReportPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", "MedicalHistory.rdl");
                    //var paths = dsParams.Tables[0].Rows[0].Field<string>("reportPath").Split("/");
                    //paths = paths.Where(s => !string.IsNullOrEmpty(s)).ToArray();

                    //switch (paths.Length)
                    //{
                    //    case 1:
                    //        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0])));
                    //        break;
                    //    case 2:
                    //        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0], paths[1])));
                    //        break;
                    //    default:
                    //        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(_configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0].Field<string>("reportPath")));
                    //        break;
                    //}
                }
                else
                {
                    return null;
                }
                //Recorremos los datatbles con sus respectivas posiciones,para llenar la información
                lr.DataSources.Add(new ReportDataSource("mainDataSet", ds.Tables[0]));
                lr.DataSources.Add(new ReportDataSource("healthChecks", ds.Tables[1]));
                lr.DataSources.Add(new ReportDataSource("behaviorTests", ds.Tables[2]));

                if (ds.Tables[3].Rows.Count > 0)
                {
                    //if (Convert.ToBoolean(item["isByte"]))
                    //{
                    lr.SetParameters(new[] { new ReportParameter("logo", FileExtensions.GetBase64FromByte((byte[])ds.Tables[3].Rows[0]["imagen"])) });
                    //}
                    //else
                    //{
                    lr.SetParameters(new[] { new ReportParameter("mimeType", ds.Tables[3].Rows[0]["mimeType"].ToString()) });
                    //}
                }


                return lr.Render("pdf", null, out _, out _, out _, out _, out _);
            }
            //var history = _context.Database.SqlQueryRaw<MedicalHistory>("EXEC Pet.MedicalHistory_Report @id",
            //                                                              new SqlParameter("@id", id)
            //                                                              ).ToList();            //var medicalHistory = await _context.MedicalHistories.FindAsync(id);


            //var pet = medicalHistory.Pet;
            //var healtTests = medicalHistory.HealthChecks;

            return data;
        }
    }
}
