using System.Data;
using Common.Core.Models;
using Common.Core.ViewModels;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class EntidadFinancieraDao
    {
        private readonly IConfiguration _config;
        protected ApiResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public EntidadFinancieraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();

        }
        public async Task<ApiResponse> CreateEntidadFinancieraAsync(int idRol, EntidadFinanciera data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPEntidadFinancieraCreate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idFormaPagoSri", data.idFormaPagoSri);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("detalle", data.detalle);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Entidad Finaciera";
            }
            return _gr;
        }
        public async Task<ApiResponse> ReadEntidadFinancieraAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<EntidadFinanciera>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPEntidadFinancieraRead", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                        cmd.Parameters.AddWithValue("pageSize", pageSize);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                                if (_gr.id == "1")
                                {
                                    var item = new EntidadFinanciera();
                                    item.idEntidadFinanciera = reader.GetInt32(4);
                                    item.descripcion = reader.GetString(5);
                                    item.detalle = reader.GetBoolean(6);
                                    item.codigo = reader.GetString(7);
                                    item.estado = reader.GetBoolean(8);
                                    item.idFormaPagoSri = reader.GetInt32(9);
                                    listar.Add(item);
                                }
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
                _gr.titleSms = "Listar Entidad Financiera";
            }
            return _gr;
        }
        public async Task<ApiResponse> UpdateEntidadFinancieraAsync(int idRol, EntidadFinanciera data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPEntidadFinancieraUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idEntidadFinanciera", data.idEntidadFinanciera);
                        cmd.Parameters.AddWithValue("idFormaPagoSri", data.idFormaPagoSri);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("detalle", data.detalle);
                        cmd.Parameters.AddWithValue("estado", data.estado);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Entidad Finaciera";
            }
            return _gr;
        }
        public async Task<ApiResponse> DeleteEntidadFinancieraAsync(int idRol, int idEntidadFinanciera)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPEntidadFinancieraDelete", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idEntidadFinanciera", idEntidadFinanciera);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar Entidad Finaciera";
            }
            return _gr;
        }

        //Operaciones Especiales 
        public async Task<ApiResponse> OptionEntidadFinancieraAsync(int idRol)
        {
            var listar = new List<EntidadFinanciera>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPEntidadFinancieraOption", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                                if (_gr.id == "1")
                                {
                                    var item = new EntidadFinanciera();
                                    item.idEntidadFinanciera = reader.GetInt32(4);
                                    item.descripcion = reader.GetString(5);
                                    item.detalle = reader.GetBoolean(6);
                                    item.codigo = reader.GetString(7);
                                    listar.Add(item);
                                }
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
                _gr.titleSms = "Select Options Financiera";
            }
            return _gr;
        }
        public async Task<ApiResponse> ListEntidadFinancieraAsync(int idRol)
        {
            var listar = new List<ContraPartidaEntidadFinancieraViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPEntidadFinancieraList", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                                if (_gr.id == "1")
                                {
                                    var item = new ContraPartidaEntidadFinancieraViewModel();
                                    item.contraPartidaEntidadFinanciera = new ContraPartidaEntidadFinanciera()
                                    {
                                        idEntidadFinanciera = reader.GetInt32(4),
                                        estado = reader.GetBoolean(5)
                                    };
                                    item.entidadFinanciera = reader.GetString(6);
                                    listar.Add(item);
                                }
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
                _gr.titleSms = "List Entidad Financiera Contra Partida";
            }
            return _gr;
        }
    }
}
