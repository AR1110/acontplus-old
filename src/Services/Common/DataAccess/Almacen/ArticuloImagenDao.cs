using System.Data;
using Common.Core.Models;
using Common.Core.Models.Almacen;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.Almacen
{
    public class ArticuloImagenDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ArticuloImagenDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> UploadImagen(int idRol, List<ArticuloImagen> list, int idArticulo)
        {
            var convetr = JsonConvert.SerializeObject(list);
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPArticuloImagenInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", idArticulo);
                    cmd.Parameters.AddWithValue("json", convetr);
                    cmd.CommandType = CommandType.StoredProcedure;
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

        public async Task<GenericResponse> GetImagenAsync(int idRol, int idArticulo)
        {
            var imgs = new List<ArticuloImagen>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPArticuloImagenGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", idArticulo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new ArticuloImagen()
                            {
                                idArticuloImagen = reader.GetInt32(3),
                                mimeType = reader.GetString(4),
                                imagenBase64 = reader.GetString(5),
                                nombreImagen = reader.GetString(6),
                            };
                            imgs.Add(item);
                        }
                    }
                }
                _gr.data = imgs;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            return _gr;
        }


        public async Task<GenericResponse> ArticuloImagenGetAllAsync(int idRol)
        {
            var imgs = new List<ArticuloImagen>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPArticuloImagenGetAll", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new ArticuloImagen()
                            {
                                idArticuloImagen = reader.GetInt32(3),
                                //idArticulo = reader.GetInt32(4),
                                mimeType = reader.GetString(5),
                                //imagen = (byte[])reader["imagen"],
                                nombreImagen = reader.GetString(7),
                                //descripcion = reader.GetString(8),
                            };
                            imgs.Add(item);
                        }
                    }
                }
                _gr.data = imgs;
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
