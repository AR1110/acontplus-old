using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.Aplicacion
{
    public class RolDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public RolDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _response = new GenericResponse();
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("App.aspRol_Get", con))
                    {
                        cmd.Parameters.AddWithValue("json", json);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                        dataAdapter.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            _response.id = "1";
                            _response.data = DataHelper.DataTableToJSON(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Listar Rol";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(AppRol data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("App.aspRol_Insert", con))
                    {
                        cmd.Parameters.AddWithValue("codLicencia", data.codLicencia);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        SqlDataReader reader = await cmd.ExecuteReaderAsync();
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
                _response.titleSms = "Insertar Rol";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(string codigo, string descripcion)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("App.aspRol_Update", con))
                    {
                        cmd.Parameters.AddWithValue("codigo", codigo);
                        cmd.Parameters.AddWithValue("descripcion", descripcion);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        SqlDataReader reader = await cmd.ExecuteReaderAsync();
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
                _response.titleSms = "Editar Rol";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(string codigo)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("App.aspRol_Delete", con))
                    {
                        cmd.Parameters.AddWithValue("codigo", codigo);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        SqlDataReader reader = await cmd.ExecuteReaderAsync();
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
                _response.titleSms = "Eliminar Rol";
            }
            finally
            {

            }
            return _response;
        }
    }
}
