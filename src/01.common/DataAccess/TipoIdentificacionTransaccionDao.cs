using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class TipoIdentificacionTransaccionDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoIdentificacionTransaccionDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }

        public async Task<GenericResponse> ReadTipoIdentificacionAsycn(int idRol, HelpersResponse data)
        {
            var listar = new List<TipoIdentificacionTransaccion>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTipoIdentificaionRead", con);
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
                            var item = new TipoIdentificacionTransaccion();
                            item.idTipoIdentificacionTransaccion = reader.GetInt32(4);
                            item.codigo = reader.GetString(5);
                            item.idTipoTransaccion = reader.GetInt32(6);
                            item.transanccion = reader.GetString(7);
                            item.idTipoIdentificacion = reader.GetInt32(8);
                            item.identificacion = reader.GetString(9);
                            item.codigoIdentificacion = reader.GetString(10);
                            listar.Add(item);
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
                _gr.titleSms = "Listar Tipo Identificacion";
            }
            return _gr;
        }
        public GenericResponse GetByType(int idRol, string tipo)
        {
            var list = new List<TipoIdentificacionTransaccion>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoIdentificaionRead", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("tipoValidacion", tipo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                        if (_gr.id == "1")
                        {
                            var item = new TipoIdentificacionTransaccion()
                            {
                                idTipoIdentificacionTransaccion = reader.GetInt32(4),
                                codigo = reader.GetString(5),
                                idTipoTransaccion = reader.GetInt32(6),
                                transanccion = reader.GetString(7),
                                idTipoIdentificacion = reader.GetInt32(8),
                                identificacion = reader.GetString(9),
                                codigoIdentificacion = reader.GetString(10),
                            };
                            list.Add(item);
                        }
                    }
                }
                _gr.data = list;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Type Identification Failed";
            }
            return _gr;
        }
    }
}
