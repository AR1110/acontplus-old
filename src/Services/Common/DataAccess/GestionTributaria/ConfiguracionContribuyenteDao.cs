using System.Data;
using System.Data.SqlClient;
using Domain.Models.GestionTributaria;
using Domain.ViewModels.GestionTributaria;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.GestionTributaria
{
    public class ConfiguracionContribuyenteDao
    {
        protected GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ConfiguracionContribuyenteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> InsertAsync(int idRol, ConfigContribuyenteViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPConfigContribuyenteInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idSubContribuyenteEmpresa", data.config.idSubContribuyenteEmpresa);
                    cmd.Parameters.AddWithValue("idSubContribuyenteProveedor", data.config.idSubContribuyenteProveedor);
                    cmd.Parameters.AddWithValue("renta", data.config.renta);
                    cmd.Parameters.AddWithValue("iva", data.config.iva);
                    var p = JsonConvert.SerializeObject(data.detalle);
                    cmd.Parameters.Add(new SqlParameter("json", p));
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
                _gr.titleSms = "Registrar ConfiguracionContribuyente";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol)
        {
            var listar = new List<ConfigContribuyenteViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPConfigContribuyenteGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
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
                            var cc = new ConfigContribuyenteViewModel
                            {
                                config = new ConfiguracionContribuyente()
                                {
                                    idConfiguracionContribuyente = reader.GetInt32(3),
                                    renta = reader.GetBoolean(4),
                                    iva = reader.GetBoolean(5)
                                },
                                subContribuyenteEmpresa = reader.GetString(6),
                                subContribuyenteProveedor = reader.GetString(7),
                                tipoContribuyenteEmpresa = reader.GetString(8),
                                tipoContribuyenteProveedor = reader.GetString(9),
                            };
                            listar.Add(cc);

                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar ConfiguracionContribuyente";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idConfiguracionContribuyente)
        {
            var config = new ConfigContribuyenteViewModel();
            var detalle = new List<ConfigContribuyenteDetalleViewModel>();
            var data = new ConfigContribuyenteData();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPConfigContribuyenteGetId", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idConfiguracionContribuyente", idConfiguracionContribuyente);
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
                            config.config = new ConfiguracionContribuyente()
                            {
                                idConfiguracionContribuyente = reader.GetInt32(3),
                                idSubContribuyenteEmpresa = reader.GetInt32(4),
                                idSubContribuyenteProveedor = reader.GetInt32(5),
                                renta = reader.GetBoolean(6),
                                iva = reader.GetBoolean(7),
                            };

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new ConfigContribuyenteDetalleViewModel()
                                {
                                    detalle = new ConfiguracionContribuyenteDetalle()
                                    {
                                        idConfiguracionContribuyenteDetalle = reader.GetInt32(0),
                                        idTipoImpuestoRenta = reader.GetInt32(1),
                                        idRetencionIva = reader.GetInt32(2),
                                    }
                                };
                                detalle.Add(item);
                            }
                        }
                    }
                }
                data.config = config;
                data.detalle = detalle;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId configuracion contribuyente";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> PutAsycn(int idRol, int idConfiguracionContribuyente, ConfigContribuyenteViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPConfigContribuyenteUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idConfiguracionContribuyente", idConfiguracionContribuyente);
                    cmd.Parameters.AddWithValue("renta", data.config.renta);
                    cmd.Parameters.AddWithValue("iva", data.config.iva);
                    var p = JsonConvert.SerializeObject(data.detalle);
                    cmd.Parameters.Add(new SqlParameter("json", p));
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
                _gr.titleSms = "Actualizar ConfiguracionContribuyente";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idConfiguracionContribuyente)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPConfigContribuyenteDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idConfiguracionContribuyente", idConfiguracionContribuyente);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.message = reader.GetString(1);
                            _gr.titleSms = reader.GetString(2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar ConfiguracionContribuyente";
            }
            finally
            {

            }
            return _gr;
        }
    }
}