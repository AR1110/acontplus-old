
using Domain.Dtos;
using Domain.Models.Almacen;
using Domain.ViewModels.Almacen;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.Almacen
{
    public class ArticuloDao
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ArticuloDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _response = new GenericResponse();
        }
        public async Task<GenericResponse> SearchFilterAsync(int idRol, string busqueda, bool condicion)
        {
            var filter = new List<ArticuloViewModel>();
            var codigo = new ArticuloViewModel();
            var search = new ArticuloSearchViewModel();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPArticuloSearchFilter", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("busqueda", busqueda ?? "");
                    cmd.Parameters.AddWithValue("condicion", condicion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _response.id = reader.GetString(0);

                            switch (_response.id)
                            {
                                case "1":

                                    var item = new ArticuloViewModel
                                    {
                                        articulo = new Articulo()
                                        {
                                            idArticulo = reader.GetInt32(1),
                                            descripcion = reader.GetString(2),
                                            codigo = reader.GetString(3),
                                        },
                                        stockBodega = reader.GetDecimal(4),
                                        bodega = reader.GetString(5),
                                        ubicacion = reader.GetString(6),
                                        stockTotal = reader.GetDecimal(7),
                                        presentacion = reader.GetString(8),
                                        idPresentacion = reader.GetInt32(9),
                                        table = reader.GetString(10),
                                        precios = reader.GetString(11),
                                    };
                                    filter.Add(item);
                                    break;


                                case "2":

                                    codigo = new ArticuloViewModel()
                                    {
                                        articulo = new Articulo()
                                        {
                                            idArticulo = reader.GetInt32(1),
                                            descripcion = reader.GetString(2),
                                            codigo = reader.GetString(3),
                                        },
                                        idPresentacion = reader.GetInt32(4),
                                        presentacion = reader.GetString(5),
                                    };
                                    break;

                            }
                        }
                    }

                    search.filter = filter;
                    search.codigo = codigo;
                    _response.data = search;
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Buscar Articulo Filtro";
            }
            finally
            {

            }
            return _response;

        }
        public async Task<GenericResponse> SearchFilterFraccAsync(int idRol, string busqueda)
        {
            var filter = new List<ArticuloViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPArticuloSearchFraccFilter", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("busqueda", busqueda ?? "");
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _response.id = reader.GetString(0);
                            if (_response.id == "1")
                            {

                                var item = new ArticuloViewModel
                                {
                                    articulo = new Articulo()
                                    {
                                        idArticulo = reader.GetInt32(1),
                                        descripcion = reader.GetString(2),
                                        codigo = reader.GetString(3),
                                        precioCosto = reader.GetDecimal(9),
                                    },
                                    stockBodega = reader.GetDecimal(4),
                                    bodega = reader.GetString(5),
                                    ubicacion = reader.GetString(6),
                                    stockTotal = reader.GetDecimal(7),
                                    nombreMedida = reader.GetString(8),
                                };
                                filter.Add(item);

                            }
                        }
                    }
                    _response.data = filter;
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
            }
            finally
            {

            }
            return _response;

        }
        public async Task<GenericResponse> HistoryEntradaAsync(int idRol, int idArticulo)
        {
            var listar = new List<ArticuloDto>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPArticuloHistoryEntrada", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idArticulo", idArticulo);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _response.id = reader.GetString(0);
                                _response.typeNotify = reader.GetString(1);
                                _response.message = reader.GetString(2);
                                _response.titleSms = reader.GetString(3);
                                if (_response.id == "1")
                                {
                                    var item = new ArticuloDto();
                                    item.proveedor = reader.GetString(4);
                                    item.precioCosto = reader.GetDecimal(5);
                                    item.numeroFactura = reader.GetString(6);
                                    item.fechaEmision = reader.GetDateTime(7).ToString("yy-MM-dd");
                                    item.cantidad = reader.GetDecimal(8);
                                    item.total = reader.GetDecimal(9);
                                    item.tipoDocumento = reader.GetString(10);
                                    listar.Add(item);
                                }
                            }
                        }

                    }
                    _response.data = listar;
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.typeNotify = "warning";
                _response.message = ex.Message;
                _response.titleSms = "Historial de Precio";
            }
            return _response;
        }


    }
}
