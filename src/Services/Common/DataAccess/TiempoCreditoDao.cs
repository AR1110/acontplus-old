using Domain.Models;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class TiempoCreditoDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TiempoCreditoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> InsertAsync(int idRol, TiempoCredito data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTiempoCreditoInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("gestion", data.gestion);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("diasCredito", data.diasCredito);
                    cmd.Parameters.AddWithValue("numeroCuota", data.numeroCuota);
                    cmd.Parameters.AddWithValue("entrada", data.entrada);
                    cmd.Parameters.AddWithValue("tipo", data.tipo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
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
                _gr.titleSms = "Registrar Tiempo Interes";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<TiempoCreditoViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTiempoCreditoGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new TiempoCreditoViewModel();

                            item.tiempoCredito = new TiempoCredito()
                            {
                                idTiempoCredito = reader.GetInt32(3),
                                gestion = reader.GetBoolean(4),
                                diasCredito = reader.GetInt32(5),
                                numeroCuota = reader.GetInt32(6),
                                descripcion = reader.GetString(7),
                                entrada = reader.GetBoolean(8),
                                estado = reader.GetBoolean(9),
                                tipo = reader.GetBoolean(10),
                            };
                            item.nombreGestion = reader.GetString(11);
                            item.nombreEntrada = reader.GetString(12);
                            item.tipoCredito = reader.GetString(13);
                            item.totalRecords = reader.GetInt32(14);
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
                _gr.titleSms = "Listar Tiempo Interes";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idTiempoCredito, TiempoCredito data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTiempoCreditoUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTiempoCredito", idTiempoCredito);
                    cmd.Parameters.AddWithValue("gestion", data.gestion);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("diasCredito", data.diasCredito);
                    cmd.Parameters.AddWithValue("numeroCuota", data.numeroCuota);
                    cmd.Parameters.AddWithValue("entrada", data.entrada);
                    cmd.Parameters.AddWithValue("tipo", data.tipo);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
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
                _gr.titleSms = "Actualizar Tiempo Interes";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idTiempoCredito)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTiempoCreditoDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTiempoCredito", idTiempoCredito);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
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
                _gr.titleSms = "Eliminar Tiempo Interes";
            }
            return _gr;
        }
        //Operaciones Especiales 
        public async Task<GenericResponse> OptionAsync(int idRol, bool gestion)
        {
            var listar = new List<TiempoCredito>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTiempoCreditoOption", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("gestion", gestion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        if (_gr.id == "1")
                        {

                            var _tt = new TiempoCredito()
                            {
                                idTiempoCredito = reader.GetInt32(3),
                                descripcion = reader.GetString(4),
                                diasCredito = reader.GetInt32(5),
                                numeroCuota = reader.GetInt32(6),
                                entrada = reader.GetBoolean(7)
                            };
                            listar.Add(_tt);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Tiempo Interes";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetAllAsync(int idRol)
        {
            var listar = new List<TiempoCredito>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTiempoCreditoGetAll", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        if (_gr.id == "1")
                        {

                            var _tt = new TiempoCredito()
                            {
                                idTiempoCredito = reader.GetInt32(3),
                                descripcion = reader.GetString(4),
                                diasCredito = reader.GetInt32(5),
                                numeroCuota = reader.GetInt32(6),
                                entrada = reader.GetBoolean(7)
                            };
                            listar.Add(_tt);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Tiempo Interes";
            }
            return _gr;
        }
    }
}
