using Domain.Models;
using Domain.ViewModels.Administracion;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class EntidadDao
    {
        protected GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public EntidadDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> OptionAsync(int idRol)
        {
            var listar = new List<Entidad>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspEntidadOption", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        if (_gr.id == "1")
                        {
                            var item = new Entidad
                            {
                                idEntidad = reader.GetInt32(2),
                                razonSocial = reader.GetString(3),
                                ruc = reader.GetString(4),
                                nombreComercial = reader.GetString(5),
                            };
                            listar.Add(item);
                        }

                    }
                    _gr.data = listar;
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetByAccessAsync(int idRol, int idUsuario)
        {
            var listar = new List<EntidadViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspEntidadByAccess", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idUsuario", idUsuario);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        if (_gr.id == "1")
                        {
                            var e = new EntidadViewModel
                            {
                                entidad = new Entidad()
                                {
                                    idEntidad = reader.GetInt32(1),
                                    razonSocial = reader.GetString(2),
                                    ruc = reader.GetString(3),
                                    estado = reader.GetBoolean(4),
                                },
                                idUsuario = reader.GetInt32(5),
                                idPolitica = reader.GetInt32(6),
                            };
                            listar.Add(e);
                        }
                    }
                    _gr.data = listar;
                }

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Entidades por Acceso de Usuario";
            }
            finally
            {

            }
            return _gr;
        }
    }
}