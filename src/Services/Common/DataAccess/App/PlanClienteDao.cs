using System.Data;
using System.Data.SqlClient;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Aplicacion
{
    public class PlanClienteDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public PlanClienteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> UpdateAsync(string ruc, string codigo)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("App.aspPlanCliente_Update", con))
                    {
                        cmd.Parameters.AddWithValue("ruc", ruc);
                        cmd.Parameters.AddWithValue("codigo", codigo);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        SqlDataReader reader = await cmd.ExecuteReaderAsync();
                        while (await reader.ReadAsync())
                        {
                            _response.id = reader.GetString(0);
                            _response.message = reader.GetString(1);
                            _response.titleSms = reader.GetString(2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Editar PlaCliente";
            }
            finally
            {

            }
            return _response;
        }
    }
}
