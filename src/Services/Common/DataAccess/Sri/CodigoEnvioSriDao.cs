using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class CodigoEnvioSriDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CodigoEnvioSriDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> GetAsync()
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Sri.aspCodigoEnvioSriGet", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _gr.id = "1";
                        _gr.data = DataHelper.DataTableToJSON(dt);
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
