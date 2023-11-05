using System.Data;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Sri
{
    public class CodigoEnvioSriDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CodigoEnvioSriDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> GetAsync()
        {
            var dt = new DataTable();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Sri.aspCodigoEnvioSriGet", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _gr.id = "1";
                        _gr.data = DataConverters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Codigos";
            }
            finally
            {

            }
            return _gr;
        }
    }
}
