using System.Data.SqlClient;
using Domain.Models;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class EstadoDocumentoDao
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public EstadoDocumentoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
        }
        public GenericResponse _response = new GenericResponse();
        public async Task<GenericResponse> GetAsync(string json)
        {
            var data = new List<EstadoPago>();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("Gestion.EstadoDocumento_Get", con);
                    cmd.Parameters.AddWithValue("json", json);
                    await con.OpenAsync();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        var item = new EstadoPago
                        {
                            idEstadoPago = reader.GetInt32(0),
                            codigo = reader.GetString(1),
                            descripcion = reader.GetString(2),
                            estado = reader.GetBoolean(3)
                        };
                        data.Add(item);
                    }
                }
                _response.data = data;
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {

            }

            return _response;
        }
        //public async Task<GenericResponse> GetByIdAsync(int id)
        //{
        //    var item = new EstadoPago();

        //    try
        //    {
        //        using (var cmd = new SqlCommand("ASPEstadoPagoGetById", con))
        //        {
        //            cmd.Parameters.AddWithValue("id", id);
        //            await con.OpenAsync();
        //            cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //            SqlDataReader reader = cmd.ExecuteReader();
        //            while (reader.Read())
        //            {
        //                item.idEstadoPago = reader.GetInt32(0);
        //                item.codigo = reader.GetString(1);
        //                item.descripcion = reader.GetString(2);
        //                item.estado = reader.GetBoolean(3);
        //            }
        //        }
        //        _response.data = item;
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.id = "0";
        //        _response.message = ex.Message;
        //    }
        //    finally
        //    {
        //        
        //    }

        //    return _response;
        //}
        //public async Task<GenericResponse> InsertAsync(int idRol, EstadoPago data)
        //{
        //    try
        //    {
        //        using (var cmd = new SqlCommand("ASPEstadoPagoInsert", con))
        //        {
        //            cmd.Parameters.AddWithValue("idRol", idRol);
        //            cmd.Parameters.AddWithValue("codigo", data.codigo);
        //            cmd.Parameters.AddWithValue("descripcion", data.descripcion);
        //            await con.OpenAsync();
        //            cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //            SqlDataReader reader = cmd.ExecuteReader();
        //            while (reader.Read())
        //            {
        //                _response.id = reader.GetString(0);
        //                _response.message = reader.GetString(1);
        //                _response.titleSms = reader.GetString(2);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.id = "0";
        //        _response.message = ex.Message;
        //    }
        //    finally
        //    {
        //        
        //    }

        //    return _response;
        //}
        //public async Task<GenericResponse> UpdateAsync(int idRol, int id, EstadoPago data)
        //{
        //    try
        //    {
        //        using (var cmd = new SqlCommand("ASPEstadoPagoUpdate", con))
        //        {
        //            cmd.Parameters.AddWithValue("idRol", idRol);
        //            cmd.Parameters.AddWithValue("id", id);
        //            cmd.Parameters.AddWithValue("codigo", data.codigo);
        //            cmd.Parameters.AddWithValue("descripcion", data.descripcion);
        //            cmd.Parameters.AddWithValue("estado", data.estado);
        //            await con.OpenAsync();
        //            cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //            SqlDataReader reader = cmd.ExecuteReader();
        //            while (reader.Read())
        //            {
        //                _response.id = reader.GetString(0);
        //                _response.message = reader.GetString(1);
        //                _response.titleSms = reader.GetString(2);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.id = "0";
        //        _response.message = ex.Message;
        //    }
        //    finally
        //    {
        //        
        //    }

        //    return _response;
        //}
        //public async Task<GenericResponse> DeleteAsync(int idRol, int id)
        //{
        //    var data = new List<EstadoPago>();

        //    try
        //    {
        //        using (var cmd = new SqlCommand("ASPEstadoPagoDelete", con))
        //        {
        //            cmd.Parameters.AddWithValue("idRol", idRol);
        //            cmd.Parameters.AddWithValue("id", id);
        //            await con.OpenAsync();
        //            cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //            SqlDataReader reader = cmd.ExecuteReader();
        //            while (reader.Read())
        //            {
        //                _response.id = reader.GetString(0);
        //                _response.message = reader.GetString(1);
        //                _response.titleSms = reader.GetString(2);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.id = "0";
        //        _response.message = ex.Message;
        //    }
        //    finally
        //    {
        //        
        //    }

        //    return _response;
        //}
    }
}
