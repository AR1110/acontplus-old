using System.Data;
using System.Data.SqlClient;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Estadisticas
{
    public class EstadisticaCompraDao
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public EstadisticaCompraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
        }
        public async Task<string> GetAsync(string json)
        {
            DataTable _dt = new DataTable();
            var response = "";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspReporteCompraEstadistica", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(_dt);
                    if (_dt.Rows.Count > 0)
                    {
                        response = Converters.DataTableToJSON(_dt);
                    }
                    dataAdapter.Dispose();
                }
            }
            finally
            {

            }

            return response;
        }
    }
}
