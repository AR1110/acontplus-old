using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Aplicacion
{
    public class EntidadDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public EntidadDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("App.aspEntidad_Get", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _response.id = "1";
                        _response.data = Converters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Entidad Listar";
            }
            finally
            {

            }
            return _response;

        }
        public async Task<GenericResponse> GetIdAsync(int id)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("App.aspEntidad_GetId", con);
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _response.id = "1";
                        _response.data = Converters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Entidad GetId";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(Entidad data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("App.aspEntidad_Insert", con);
                    cmd.Parameters.AddWithValue("ruc", data.ruc);
                    cmd.Parameters.AddWithValue("razonSocial", data.razonSocial);
                    cmd.Parameters.AddWithValue("nombreComercial", data.nombreComercial);
                    cmd.Parameters.AddWithValue("email", DataValidation.ToDBNullOrDefault(data.email));
                    cmd.Parameters.AddWithValue("telefono", DataValidation.ToDBNullOrDefault(data.telefono));
                    cmd.Parameters.AddWithValue("direccion", DataValidation.ToDBNullOrDefault(data.direccion));
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Registrar Entidad";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int id, Entidad data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("App.aspEntidad_Update", con);
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.Parameters.AddWithValue("ruc", data.ruc);
                    cmd.Parameters.AddWithValue("idCiudad", data.idCiudad);
                    cmd.Parameters.AddWithValue("razonSocial", data.razonSocial);
                    cmd.Parameters.AddWithValue("nombreComercial", data.nombreComercial);
                    cmd.Parameters.AddWithValue("email", DataValidation.ToDBNullOrDefault(data.email));
                    cmd.Parameters.AddWithValue("telefono", DataValidation.ToDBNullOrDefault(data.telefono));
                    cmd.Parameters.AddWithValue("direccion", DataValidation.ToDBNullOrDefault(data.direccion));
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Actualizar Entidad";
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
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("App.aspEntidad_Delete", con);
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Eliminar Entidad";
            }
            finally
            {

            }
            return _response;
        }

    }
}
