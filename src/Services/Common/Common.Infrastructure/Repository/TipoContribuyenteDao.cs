using System.Data;
using Common.Core.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class TipoContribuyenteDao
    {
        private readonly IConfiguration _config;
        protected ApiResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoContribuyenteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();

        }
        //Gestios de informacion
        public async Task<ApiResponse> CreateTipoContribuyenteAsync(int idRol, TipoContribuyente data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoContribuyenteCreate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
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
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar TipoContribuyente";
            }
            return _gr;
        }
        public async Task<ApiResponse> ReadTipoContribuyente(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<TipoContribuyente>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoContribuyenteRead", con))
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
                                    var tp = new TipoContribuyente
                                    {
                                        idTipoContribuyente = reader.GetInt32(4),
                                        descripcion = reader.GetString(5),
                                        codigo = reader.GetString(6),
                                        totalRecords = reader.GetInt32(7)
                                    };
                                    listar.Add(tp);
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
                _gr.titleSms = "TipoContribuyente Listar";
            }


            return _gr;
        }
        public async Task<ApiResponse> UpdateTipoContribuyenteAsync(int idRol, TipoContribuyente data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoContribuyenteUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTipoContribuyente", data.idTipoContribuyente);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
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
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar TipoContribuyente";
            }
            return _gr;
        }
        public async Task<ApiResponse> DeleteTipoContribuyenteAsync(int idRol, int idTipoContribuyente)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoContribuyenteDelete", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTipoContribuyente", idTipoContribuyente);
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
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar TipoContribuyente";
            }
            return _gr;
        }
        //Operaciones Especiales 
        public async Task<ApiResponse> OptionTipoContribuyenteAsync(int idRol)
        {
            var listar = new List<TipoContribuyente>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoContribuyenteOption", con))
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
                                    var tp = new TipoContribuyente
                                    {
                                        idTipoContribuyente = reader.GetInt32(4),
                                        descripcion = reader.GetString(5),
                                        codigo = reader.GetString(6)
                                    };
                                    listar.Add(tp);
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
                _gr.titleSms = "TipoContribuyente Option";
            }


            return _gr;
        }
    }
}