using System.Data;
using Common.Core.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class TipoIceDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoIceDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }

        //Gestios de informacion 
        public async Task<GenericResponse> CreateTipoIceAsync(int idRol, TipoIce data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoIceCreate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                   //     cmd.Parameters.AddWithValue("idActividadEmpresa", data.actividadEmpresa.idActividadEmpresa);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("porcentaje", data.porcentaje);
                        cmd.Parameters.AddWithValue("valor", data.valor);
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
                _gr.titleSms = "Registrar Tipo Ice";
            }
            return _gr;
        }
        public async Task<GenericResponse> ReadTipoIceAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<TipoIce>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoIceRead", con))
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
                                    var ti = new TipoIce
                                    {
                                        idTipoIce = reader.GetInt32(4),
                                        codigo = reader.GetString(5),
                                        descripcion = reader.GetString(6),
                                        porcentaje = reader.GetDecimal(7),
                                        valor = reader.GetDecimal(8),
                                        estado = reader.GetBoolean(9),
                                        totalRecords = reader.GetInt32(10)
                                    };
                                  //  ti.actividadEmpresa = new ActividadEmpresa()
                                    {
                                        idActividadEmpresa = reader.GetInt32(11),
                                        descripcion = reader.GetString(12)
                                    };
                                    listar.Add(ti);
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
                _gr.titleSms = "Listas Tipo Ice";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateTipoIceAsync(int idRol, TipoIce data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoIceUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTipoIce", data.idTipoIce);
                        cmd.Parameters.AddWithValue("idActividadEmpresa",0);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("porcentaje", data.porcentaje);
                        cmd.Parameters.AddWithValue("valor", data.valor);
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
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Tipo Ice";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteTipoIceAsync(int idRol, int idTipoIce)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoIceDelete", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTipoIce", idTipoIce);
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
                _gr.titleSms = "Eliminar Tipo Ice";
            }
            return _gr;
        }
        public async Task<GenericResponse> OptionTipoIceAsync(int idRol)
        {
            var listar = new List<TipoIce>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPTipoIceOption", con))
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
                                    var ti = new TipoIce
                                    {
                                        idTipoIce = reader.GetInt32(4),
                                        codigo = reader.GetString(5),
                                        descripcion = reader.GetString(6),
                                        porcentaje = reader.GetDecimal(7),
                                        valor = reader.GetDecimal(8),
                                    };

                                    listar.Add(ti);
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
                _gr.titleSms = "options Tipo Ice";
            }
            return _gr;
        }
    }
}
