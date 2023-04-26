using Domain.Models;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class EmpleadoDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public EmpleadoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> InsertAsync(int idRol, Empleado data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEmpleadoPost", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTipoIdentificacion", data.idTipoIdentificacion);
                    cmd.Parameters.AddWithValue("nroIdentificacion", data.nroIdentificacion);
                    cmd.Parameters.AddWithValue("nombreCompleto", data.nombreCompleto);
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
                _gr.titleSms = "Registrar Empleado";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var empleados = new List<EmpleadoViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEmpleadoGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new EmpleadoViewModel();
                            item.empleado = new Empleado()
                            {
                                idEmpleado = reader.GetInt32(3),
                                idTipoIdentificacion = reader.GetInt32(4),
                                nroIdentificacion = reader.GetString(5),
                                nombreCompleto = reader.GetString(6),
                                estado = reader.GetBoolean(7)
                            };
                            item.totalClientes = reader.GetInt32(8);
                            item.totalRecords = reader.GetInt32(9);
                            empleados.Add(item);
                        }
                    }
                }
                _gr.data = empleados;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Empleados";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idEmpleado, Empleado data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEmpleadoUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idEmpleado", idEmpleado);
                    cmd.Parameters.AddWithValue("idTipoIdentificacion", data.idTipoIdentificacion);
                    cmd.Parameters.AddWithValue("nroIdentificacion", data.nroIdentificacion);
                    cmd.Parameters.AddWithValue("nombreCompleto", data.nombreCompleto);
                    cmd.Parameters.AddWithValue("estado", data.estado);
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
                _gr.titleSms = "Actualizar Empleado";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idEmpleado)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEmpleadoDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idEmpleado", idEmpleado);
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
                _gr.titleSms = "Eliminar Empleado";
            }
            return _gr;
        }
        public async Task<GenericResponse> SearchAsync(int idRol, string busqueda)
        {
            var list = new List<Empleado>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPEmpleadoSearch", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("busqueda", busqueda);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new Empleado()
                            {
                                idEmpleado = reader.GetInt32(3),
                                nroIdentificacion = reader.GetString(4),
                                nombreCompleto = reader.GetString(5)
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
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Busqueda Empleado";

            }
            return _gr;
        }
    }
}
