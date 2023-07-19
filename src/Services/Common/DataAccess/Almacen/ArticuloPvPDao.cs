using Domain.Models;
using Domain.Models.Almacen;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.Almacen
{
    public class ArticuloPvPDao
    {
        protected GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ArticuloPvPDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }

        //Gestion de Informacion

        public async Task<GenericResponse> GetIdAsync(int idRol, int idArticulo)
        {

            var listar = new List<ArticuloPvPViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPArticuloPvPGetId", con);

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
                            var item = new ArticuloPvPViewModel
                            {
                                articuloPvP = new ArticuloPvP()
                                {
                                    idArticuloPvP = reader.GetInt32(3),
                                    idTarifa = reader.GetInt32(4),
                                    precioVenta = reader.GetDecimal(5),
                                    precioConIva = reader.GetDecimal(6),
                                    porcentajeUtilidad = reader.GetDecimal(7),
                                    precioPredeterminado = reader.GetBoolean(8),
                                },
                                tarifa = reader.GetString(9),
                                porcentajeIva = reader.GetDecimal(10)
                            };
                            listar.Add(item);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Articulo Tarifa";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetTarifaPrecioAsync(int idRol)
        {

            var listar = new List<ArticuloPvPViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPTarifaOption", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                                if (_gr.id == "1")
                                {
                                    var item = new ArticuloPvPViewModel();
                                    item.articuloPvP = new ArticuloPvP()
                                    {
                                        idTarifa = reader.GetInt32(4),
                                    };
                                    item.predeterminada = reader.GetBoolean(5);
                                    item.tarifa = reader.GetString(6);

                                    listar.Add(item);
                                }
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
                _gr.titleSms = "Select Tarifa de Precio";
            }
            return _gr;
        }

        //Operaciones Especiales. 
        public async Task<GenericResponse> ListArticuloTarifaAsync(int idRol, int idArticulo)
        {
            var listar = new List<ArticuloFraccionadoPvPViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPArticuloTarifaList", con);
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
                                var item = new ArticuloFraccionadoPvPViewModel();
                                item.pvp = new ArticuloFraccionadoPvP()
                                {
                                    idTarifa = reader.GetInt32(4),
                                    precioVenta = reader.GetDecimal(5),
                                };
                                item.tarifa = reader.GetString(6);
                                item.porcentajeIva = reader.GetDecimal(7);
                                listar.Add(item);
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
                _gr.titleSms = "Listar Tarifas Articulo";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetForPvPAsync(int idRol, int idArticulo, string tipoArticulo)
        {
            var pvps = new List<ArticuloPvPViewModel>();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPArticuloGetForPvP", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", idArticulo);
                    cmd.Parameters.AddWithValue("tipoArticulo", tipoArticulo);
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
                            var item = new ArticuloPvPViewModel
                            {
                                articuloPvP = new ArticuloPvP()
                                {
                                    idTarifa = reader.GetInt32(3),
                                    precioVenta = reader.GetDecimal(4),
                                    precioConIva = reader.GetDecimal(5),
                                    porcentajeUtilidad = reader.GetDecimal(6),
                                },
                                tarifa = reader.GetString(7),
                                porcentajeIva = reader.GetDecimal(8)
                            };
                            pvps.Add(item);
                        }
                    }
                }
                _gr.data = pvps;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar los pvp de articulo";
            }
            finally
            {

            }
            return _gr;

        }
    }
}