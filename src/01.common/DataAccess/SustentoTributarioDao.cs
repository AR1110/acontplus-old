using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class SustentoTributarioDao
    {

        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public SustentoTributarioDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> ReadSustentoTributarioAsync()
        {
            var listar = new List<SustentoTributario>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {

                    SqlCommand cmd = new SqlCommand("ASPSustentoTributarioRead", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                            if (_gr.id == "1")
                            {
                                var _st = new SustentoTributario()
                                {
                                    idSustentoTributario = reader.GetInt32(4),
                                    descripcion = reader.GetString(5),
                                    codigo = reader.GetString(6)
                                };
                                listar.Add(_st);
                            }
                        }
                    }
                }
                _gr.data = listar;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Sustento Tributario";
            }
            return _gr;
        }
    }
}
