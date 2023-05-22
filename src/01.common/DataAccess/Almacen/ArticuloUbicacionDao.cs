using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.Almacen
{
    public class ArticuloUbicacionDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ArticuloUbicacionDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> InsertAsync(int idRol, ArticuloUbicacion data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPArticuloUbicacionCreate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", data.idArticulo);
                    cmd.Parameters.AddWithValue("idBodega", data.idBodega);
                    cmd.Parameters.AddWithValue("ubicacion", data.ubicacion);
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
                _gr.titleSms = "Listar Ubicacion de Articulo";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol, int idArticulo)
        {
            var listar = new List<ArticuloUbicacionOperaciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPArticuloUbicacionRead", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", idArticulo);
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
                                var _uo = new ArticuloUbicacionOperaciones
                                {
                                    articuloUbicacion = new ArticuloUbicacion()
                                    {
                                        idArticuloUbicacion = reader.GetInt32(4),
                                        ubicacion = reader.GetString(5),
                                        estado = reader.GetBoolean(6),
                                    },
                                    bodega = new Bodega()
                                    {
                                        idBodega = reader.GetInt32(7),
                                        descripcion = reader.GetString(8)
                                    }
                                };
                                listar.Add(_uo);
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
                _gr.titleSms = "Listar Ubicacion de Articulo";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int id, ArticuloUbicacion data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPArticuloUbicacionUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticuloUbicacion", id);
                    cmd.Parameters.AddWithValue("idArticulo", data.idArticulo);
                    cmd.Parameters.AddWithValue("idBodega", data.idBodega);
                    cmd.Parameters.AddWithValue("ubicacion", data.ubicacion);
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
                _gr.titleSms = "Actualizar Ubicacion de Articulo";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idArticuloUbicacion)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPArticuloUbicacionDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticuloUbicacion", idArticuloUbicacion);
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
                _gr.titleSms = "Eliminar Ubicacaion de Articulo";
            }
            return _gr;
        }
    }
}