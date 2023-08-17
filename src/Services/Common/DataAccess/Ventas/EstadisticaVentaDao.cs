using System.Data;
using System.Data.SqlClient;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Ventas
{
    public class EstadisticaVentaDao
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public EstadisticaVentaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
        }
        public async Task<string> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            string response = "";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPReporteVentaEstadistica", con))
                    {
                        cmd.Parameters.AddWithValue("json", json);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                        dataAdapter.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            response = Converters.DataTableToJSON(dt);
                        }
                        dataAdapter.Dispose();
                    }
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
