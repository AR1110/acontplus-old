using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;

namespace DataAccess
{
    public class EntidadLogoDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public EntidadLogoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> GetAsync(int idRol)
        {
            var logos = new List<EntidadLogo>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEntidadLogoGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new EntidadLogo
                            {
                                idEntidadLogo = reader.GetInt32(3),
                                idEntidad = reader.GetInt32(4),
                                entidad = reader.GetString(5),
                                mimeType = reader.GetString(6),
                                imagen = (byte[])reader["imagen"],
                                nombreImagen = reader.GetString(8),
                                estado = reader.GetBoolean(9)
                            };
                            logos.Add(item);
                        }
                    }
                }
                _gr.data = logos;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, EntidadLogo data, FileModel file)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEntidadLogoInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idEntidad", data.idEntidad);
                    cmd.Parameters.Add("imagen", System.Data.SqlDbType.VarBinary).Value = file.Content;
                    cmd.Parameters.AddWithValue("mimeType", file.ContentType);
                    cmd.Parameters.AddWithValue("nombreImagen", data.nombreImagen);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, EntidadLogo data, FileModel file)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEntidadLogoUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idEntidadLogo", data.idEntidadLogo);
                    cmd.Parameters.AddWithValue("idEntidad", data.idEntidad);
                    cmd.Parameters.Add("imagen", System.Data.SqlDbType.VarBinary).Value = file.Content;
                    cmd.Parameters.AddWithValue("mimeType", file.ContentType);
                    cmd.Parameters.AddWithValue("nombreImagen", data.nombreImagen);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPEntidadLogoDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }
    }
}
