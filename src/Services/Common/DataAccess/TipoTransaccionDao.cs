using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class TipoTransaccionDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoTransaccionDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> ReadTipoTransaccionAsync(int idRol, HelpersResponse data)
        {
            var listar = new List<TipoTransaccion>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTipoTransaccionRead", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("tipoValidacion", data.tipoValidacion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                        if (_gr.id == "1")
                        {
                            var _tt = new TipoTransaccion()
                            {
                                idTipoTransaccion = reader.GetInt32(4),
                                descripcion = reader.GetString(5),
                                codigo = reader.GetString(6),
                                estado = reader.GetBoolean(7)
                            };
                            listar.Add(_tt);
                        }
                    }

                    _gr.data = listar;
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Leer Tipo Transaccion";
            }
            return _gr;
        }
    }
}
