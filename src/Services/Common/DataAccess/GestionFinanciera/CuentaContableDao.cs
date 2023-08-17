using System.Data;
using System.Data.SqlClient;
using Domain.Models.GestionFinanciera;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.GestionFinanciera
{
    public class CuentaContableDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CuentaContableDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> InsertAsync(int idRol, CuentaBancaria data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCuentaBancariaInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Cuenta Bancaria";
            }
            finally
            {

            }
            return _gr;
        }
    }
}
