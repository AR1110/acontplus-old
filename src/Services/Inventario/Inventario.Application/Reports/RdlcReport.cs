using Inventario.Core.Interfaces;
using Inventario.Infrastructure.Data;
using Lib.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;
using System.Data;

namespace Inventario.Application.Reports;
public class RdlcReport : IRdlcReport
{
    private readonly InventarioContext _context;
    public RdlcReport(InventarioContext context)
    {
        _context = context;
    }
    public async Task<byte[]> Create(string spparams, string spname, string filename, string format)
    {
        DataSet ds = null;
        string[] fillDs;
        bool paramsExists;
        using (var command = _context.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = spname;
            SqlParameter paramId = new SqlParameter("json", SqlDbType.VarChar);
            paramId.Value = spparams;
            command.Parameters.Add(paramId);

            var nameParamDs = "datasets";
            var dataset = new SqlParameter(nameParamDs, SqlDbType.VarChar);
            dataset.Size = 500;
            dataset.Direction = ParameterDirection.Output;
            command.Parameters.Add(dataset);

            var hasParams = "hasParams";
            var reportParams = new SqlParameter(hasParams, SqlDbType.Bit);
            dataset.Size = 500;
            dataset.Direction = ParameterDirection.Output;
            command.Parameters.Add(reportParams);


            command.CommandType = CommandType.StoredProcedure;
            await _context.Database.OpenConnectionAsync();
            using (SqlDataAdapter adapter = new SqlDataAdapter())
            {
                adapter.SelectCommand = (SqlCommand)command;

                ds = new DataSet();
                adapter.Fill(ds);
            }

            fillDs = command.Parameters[nameParamDs].Value.ToString().Split(",");
            paramsExists = Convert.ToBoolean(command.Parameters[hasParams].Value);

        }

        if (ds.Tables.Count != fillDs.Length)
        {
            return null;
        }

        using (LocalReport lr = new LocalReport())
        {
            var path = System.IO.Directory.GetCurrentDirectory() + "\\Reports\\" + $"{filename}.rdl";
            lr.ReportPath = path;
            var totalDs = 1;
            foreach (var item in fillDs)
            {
                lr.DataSources.Add(new ReportDataSource(item, ds.Tables[totalDs]));
                totalDs++;
            }
            if (paramsExists)
            {
                if (ds.Tables[ds.Tables.Count - 1].Rows.Count > 0)
                {
                    foreach (DataRow item in ds.Tables[ds.Tables.Count - 1].Rows)
                    {
                        if (Convert.ToBoolean(item["isByte"]))
                        {
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), FileExtensions.GetBase64FromByte((byte[])item.Field<byte[]>("paramValue"))) });
                        }
                        else
                        {
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), item.Field<string>("paramValue")) });
                        }
                    }

                }
            }
            return lr.Render(format ?? "pdf", null, out _, out _, out _, out _, out _);
        }
    }
}