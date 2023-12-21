using System.Data;
using Common.Core.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class EstadisticaVentaDao
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public EstadisticaVentaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
        }
        public async Task<string> GetAsync(string json)
        {
            var dt = new DataTable();
            var response = "";
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPReporteVentaEstadistica", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        response = DataConverters.DataTableToJSON(dt);
                    }
                    dataAdapter.Dispose();
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {

            }
            return response;
        }

        public async Task<string> GetClienteVentaAsync(string json)
        {
            var dt = new DataTable();
            var response = "";
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspReporteClienteVentaEstadistica", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        response = DataConverters.DataTableToJSON(dt);
                    }
                    dataAdapter.Dispose();
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {

            }
            return response;

        }
    }
}
