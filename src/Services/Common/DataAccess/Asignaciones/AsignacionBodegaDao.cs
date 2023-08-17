using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Asignaciones
{
    public class AsignacionBodegaDao
    {
        public GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public AsignacionBodegaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("Gestion.AsignacionBodega_Get", con))
                    {
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
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Listar AsignacionSucursal";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, AsignacionBodega data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Gestion.AsignacionBodega_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idAsignacionBodega", data.idAsignacionBodega);
                    cmd.Parameters.AddWithValue("idAsignacionSucursal", data.idAsignacionSucursal);
                    cmd.Parameters.AddWithValue("idBodega", data.idBodega);
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
                _response.titleSms = "Registrar Asignacion Bodega";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Gestion.AsignacionBodega_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
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
                _response.titleSms = "Actualizar Asignacion Sucursal";
            }
            finally
            {

            }
            return _response;
        }
    }
}
