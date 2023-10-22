using System.Data;
using System.Data.SqlClient;
using Domain.Models.Aplicacion;
using Lib.Common;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;

namespace DataAccess.App
{
    public class UsuarioRolDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public UsuarioRolDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(string json)
        {
            var dt = new DataTable();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("App.aspUsuarioRol_Get", con))
                    {
                        cmd.Parameters.AddWithValue("json", json);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        var dataAdapter = new SqlDataAdapter(cmd);
                        dataAdapter.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            _response.id = "1";
                            _response.data = Converters.DataTableToJSON(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Listar UsuarioRol";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> GetIdAsync(int id)
        {
            var dt = new DataTable();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("App.aspUsuarioRol_GetId", con))
                    {
                        cmd.Parameters.AddWithValue("id", id);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        var dataAdapter = new SqlDataAdapter(cmd);
                        dataAdapter.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            _response.id = "1";
                            _response.data = Converters.DataTableToJSON(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "GetId UsuarioRol";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(UsuarioRol data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("App.aspUsuarioRol_Insert", con))
                    {
                        cmd.Parameters.AddWithValue("idUsuario", data.idUsuario);
                        cmd.Parameters.AddWithValue("idEntidad", data.idEntidad);
                        cmd.Parameters.AddWithValue("codRol", data.codRol);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        var reader = await cmd.ExecuteReaderAsync();
                        while (await reader.ReadAsync())
                        {
                            _response.id = reader.GetString(0);
                            _response.message = reader.GetString(1);
                            _response.titleSms = reader.GetString(2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Insertar UsuarioRol";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int id, string codRol)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("App.aspUsuarioRol_Update", con))
                    {
                        cmd.Parameters.AddWithValue("id", id);
                        cmd.Parameters.AddWithValue("codRol", codRol);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        var reader = await cmd.ExecuteReaderAsync();
                        while (await reader.ReadAsync())
                        {
                            _response.id = reader.GetString(0);
                            _response.message = reader.GetString(1);
                            _response.titleSms = reader.GetString(2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Editar UsuarioRol";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int id)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("App.aspUsuarioRol_Delete", con))
                    {
                        cmd.Parameters.AddWithValue("id", id);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        var reader = await cmd.ExecuteReaderAsync();
                        while (await reader.ReadAsync())
                        {
                            _response.id = reader.GetString(0);
                            _response.message = reader.GetString(1);
                            _response.titleSms = reader.GetString(2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Editar UsuarioRol";
            }
            finally
            {

            }
            return _response;
        }
    }
}
