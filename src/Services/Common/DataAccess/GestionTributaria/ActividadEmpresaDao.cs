using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class ActividadEmpresaDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ActividadEmpresaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }
        public GenericResponse GetAllAsync(int idRol)
        {
            var listar = new List<ActividadEmpresa>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPActividadEmpresaGetAll", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        if (_gr.id == "1")
                        {
                            var a = new ActividadEmpresa
                            {
                                idActividadEmpresa = reader.GetInt32(1),
                                descripcion = reader.GetString(2),
                                estado = reader.GetBoolean(3),
                            };
                            listar.Add(a);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Actividades ";
            }
            finally
            {

            }
            return _gr;
        }
        public GenericResponse GetBySucursalAsync(int idRol)
        {
            var listar = new List<ActividadEmpresa>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPActividadEmpresaBySucursal", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        if (_gr.id == "1")
                        {
                            var a = new ActividadEmpresa
                            {
                                idActividadEmpresa = reader.GetInt32(1),
                                descripcion = reader.GetString(2),
                                estado = reader.GetBoolean(3),
                            };
                            listar.Add(a);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Actividades de la Sucursal ";
            }
            finally
            {

            }
            return _gr;
        }

    }
}