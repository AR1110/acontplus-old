using System.Data;
using Common.Core.Models;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class BancoDao
    {
        protected GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public BancoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> CreateBancoAsync(int idRol, Banco data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPBancoCreate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("codigo", data.codigo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
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
                _gr.titleSms = "Registrar Banco";
            }
            return _gr;
        }
        public async Task<GenericResponse> ReadBanco(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<Banco>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPBancoRead", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                            if (_gr.id == "1")
                            {
                                var b = new Banco
                                {
                                    idBanco = reader.GetInt32(4),
                                    descripcion = reader.GetString(5),
                                    codigo = reader.GetString(6),
                                    estado = reader.GetBoolean(7),
                                    fechaRegistro = reader.GetDateTime(8).ToString("yyyy-MM-dd"),
                                    totalRecords = reader.GetInt32(9)
                                };
                                listar.Add(b);
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
                _gr.titleSms = "Listar Banco";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateBancoAsync(int idRol, Banco data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPBancoUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idBanco", data.idBanco);
                    cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Banco";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteBancoAsync(int idRol, int idBanco)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPBancoDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idBanco", idBanco);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar Banco";
            }
            return _gr;
        }

        public async Task<GenericResponse> GetByOptionAsync(int idRol)
        {
            var list = new List<Banco>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPBancoByOption", con);
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
                            var item = new Banco()
                            {
                                idBanco = reader.GetInt32(2),
                                descripcion = reader.GetString(3),
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
            }
            finally
            {

            }
            return _gr;
        }
    }
}
