using System.Data.SqlClient;
using Domain.Models;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class FirmaElectronicaDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public FirmaElectronicaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> GetAsync(int idRol)
        {
            var data = new List<FirmaElectronica>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPFirmaElectronicaGet", con);
                    cmd.Parameters.AddWithValue("@idRol", idRol);
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
                            var item = new FirmaElectronica
                            {
                                idFirmaElectronica = reader.GetInt32(3),
                                nombre = reader.GetString(4),
                                contrasenia = reader.GetString(5),
                                nombreArchivo = reader.GetString(6),
                                mimeType = reader.GetString(7)
                            };
                            data.Add(item);
                        }
                    }
                }
                _gr.data = data;
            }
            catch (System.Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, FirmaElectronica data, FileModel file)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("DocumentoTributario.FirmaElectronica_Insert", con);
                    cmd.Parameters.AddWithValue("@idRol", idRol);
                    cmd.Parameters.AddWithValue("@idEntidad", data.idEntidad);
                    cmd.Parameters.AddWithValue("@contrasenia", data.contrasenia);
                    cmd.Parameters.AddWithValue("@fileName", file.FileName);
                    cmd.Parameters.Add("firma", System.Data.SqlDbType.VarBinary).Value = file.Content;
                    cmd.Parameters.AddWithValue("@contentType", file.ContentType);
                    cmd.Parameters.AddWithValue("@fechaCaducidad", data.fechaCaducidad);
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
            catch (System.Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, FirmaElectronica data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("DocumentoTributario.FirmaElectronica_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFirmaElectronica", data.idFirmaElectronica);
                    cmd.Parameters.AddWithValue("contrasenia", data.contrasenia);
                    cmd.Parameters.AddWithValue("estado", data.estado);
                    cmd.Parameters.AddWithValue("@fechaCaducidad", data.fechaCaducidad);
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
        public async Task<GenericResponse> DeleteAsync(int idRol, int idFirmaElectronica)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPFirmaElectronicaDelete", con);
                    cmd.Parameters.AddWithValue("@idRol", idRol);
                    cmd.Parameters.AddWithValue("@idFirmaElectronica", idFirmaElectronica);
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
            catch (System.Exception ex)
            { //
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }
    }
}