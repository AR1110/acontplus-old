using System.Data;
using Common.Core.Models;
using Common.Core.Models.Administracion;
using Common.Core.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class AsignacionPuntoEmisionDao
    {
        public ApiResponse _response = new ApiResponse();
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public AsignacionPuntoEmisionDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _response = new ApiResponse();
        }
        public async Task<ApiResponse> GetAsync(string json)
        {
            var dt = new DataTable();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("Gestion.AsignacionPuntoEmision_Get", con))
                    {
                        cmd.Parameters.AddWithValue("json", json);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        var dataAdapter = new SqlDataAdapter(cmd);
                        dataAdapter.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            _response.id = "1";
                            _response.data = DataConverters.DataTableToJSON(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Listar Asignacion PuntoEmision";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<ApiResponse> InsertAsync(int idRol, AsignacionPuntoEmision data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Gestion.AsignacionPuntoEmision_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idAsignacionPuntoEmision", data.idAsignacionPuntoEmision);
                    cmd.Parameters.AddWithValue("idAsignacionSucursal", data.idAsignacionSucursal);
                    cmd.Parameters.AddWithValue("idPuntoEmision", data.idPuntoEmision);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
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
                _response.titleSms = "Registrar Asignacion PuntoEmision";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<ApiResponse> UpdateAsync(int idRol, int id)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Gestion.AsignacionPuntoEmision_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
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
                _response.titleSms = "Actualizar Asignacion PuntoEmision";
            }
            finally
            {

            }
            return _response;
        }
    }
}
