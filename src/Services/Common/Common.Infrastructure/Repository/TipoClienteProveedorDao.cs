using System.Data;
using Common.Core.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class TipoClienteProveedorDao
    {
        private readonly IConfiguration _config;
        protected ApiResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoClienteProveedorDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();

        }

        public async Task<ApiResponse> CreateTipoClienteProveedorAsync(TipoClienteProveedor data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoClienteProveedorCreate", con);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("codigo", data.codigo);
                    cmd.Parameters.AddWithValue("idTipoPersona", data.tipoPersona.idTipoPersona);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar TipoCliente/Proveedor";
            }
            return _gr;
        }
        public async Task<ApiResponse> ReadTipoClienteProveedor(int idRol, int pageIndex, int pageSize, HelpersResponse data)
        {
            var listar = new List<TipoClienteProveedor>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoClienteProveedorRead", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
                    cmd.Parameters.AddWithValue("tipoValidacion", data.tipoValidacion);
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
                                var _tp = new TipoClienteProveedor
                                {
                                    idTipoClienteProveedor = reader.GetInt32(4),
                                    descripcion = reader.GetString(5),
                                    codigo = reader.GetString(6),
                                    estado = reader.GetBoolean(7),
                                    fechaRegistro = reader.GetDateTime(8).ToString("yyyy-MM-dd"),
                                    totalRecords = reader.GetInt32(9)
                                };
                                _tp.tipoPersona = new TipoPersona()
                                {
                                    idTipoPersona = reader.GetInt32(10),
                                    descripcion = reader.GetString(11)
                                };
                                listar.Add(_tp);
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
                _gr.titleSms = "Listar TipoCliente/Proveedor";
            }
            return _gr;
        }
        public async Task<ApiResponse> UpdateTipoClienteProveedorAsync(TipoClienteProveedor data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoClienteProveedorUpdate", con);
                    cmd.Parameters.AddWithValue("idTipoClienteProveedor", data.idTipoClienteProveedor);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("idTipoPersona", data.tipoPersona.idTipoPersona);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar TipoCliente/Proveedor";
            }
            return _gr;
        }
        public async Task<ApiResponse> DeleteTipoClienteProveedorAsync(int idTipoClienteProveedor)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoClienteProveedorDelete", con);
                    cmd.Parameters.AddWithValue("idTipoClienteProveedor", idTipoClienteProveedor);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar TipoCliente/Proveedor";
            }
            return _gr;
        }

        public async Task<ApiResponse> TipoClienteProveedorSelectAsync(string tipoValidacion)
        {
            var list = new List<TipoClienteProveedor>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoClienteProveedorSelect", con);
                    cmd.Parameters.AddWithValue("tipoValidacion", tipoValidacion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new TipoClienteProveedor();
                            item.idTipoClienteProveedor = reader.GetInt32(3);
                            item.descripcion = reader.GetString(4);
                            item.codigo = reader.GetString(5);
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
                _gr.titleSms = "Listar Tipo Cliente";
            }
            return _gr;
        }
    }
}