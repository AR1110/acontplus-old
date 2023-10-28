using System.Data;
using Microsoft.Data.SqlClient;
using Common.Core.Utils;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Estadisticas
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
            DataTable dt = new DataTable();
            string response = "";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPReporteVentaEstadistica", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
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
            DataTable dt = new DataTable();
            string response = "";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspReporteClienteVentaEstadistica", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
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
