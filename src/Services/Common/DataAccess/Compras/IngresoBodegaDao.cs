using System.Data;
using Common.Core.Models;
using Common.Core.Utils;
using Domain.Models.Compras;
using Domain.ViewModels.Compras;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.Compras
{
    public class IngresoBodegaDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public IngresoBodegaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.IngresoBodega_Get", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _gr.id = "1";
                        _gr.data = DataConverters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Ingreso a Bodega";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idIngresoBodega)
        {
            var ingresoBodega = new IngresoBodegaViewModel();
            var detalle = new List<IngresoBodegaDetalleViewModel>();
            var adicional = new List<ManejoArticuloDetalleViewModel>();
            var data = new IngresoBodegaData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.IngresoBodega_GetId", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idIngresoBodega", idIngresoBodega);
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
                            ingresoBodega.ingresoBodega = new IngresoBodega()
                            {
                                idIngresoBodega = reader.GetInt64(3),
                                idProveedor = reader.GetInt32(4),
                                idPuntoEmision = reader.GetInt32(5),
                                idTiempoCredito = reader.GetInt32(6),
                                fechaEmision = reader.GetDateTime(7).ToString("yyyy-MM-dd"),
                                fechaVencimiento = reader.GetDateTime(8).ToString("yyyy-MM-dd"),
                                subTotalSinImpuestos = reader.GetDecimal(9),
                                subTotalIva = reader.GetDecimal(10),
                                subTotalNetoIva = reader.GetDecimal(11),
                                subTotalIvaCero = reader.GetDecimal(12),
                                subTotalNetoIvaCero = reader.GetDecimal(13),
                                subTotalNoObjetoIva = reader.GetDecimal(14),
                                subTotalNetoNoObjetoIva = reader.GetDecimal(15),
                                subTotalExentoIva = reader.GetDecimal(16),
                                subTotalNetoExentoIva = reader.GetDecimal(17),
                                totalDescuento = reader.GetDecimal(18),
                                porcentajeDescuento = reader.GetDecimal(19),
                                totalIce = reader.GetDecimal(20),
                                irbpnr = reader.GetDecimal(21),
                                propina = reader.GetDecimal(22),
                                iva = reader.GetDecimal(23),
                                recargo = reader.GetDecimal(24),
                                transporte = reader.GetDecimal(25),
                                total = reader.GetDecimal(26),
                                observacion = reader.GetString(27),
                            };
                            ingresoBodega.nombreFiscal = reader.GetString(28);
                            ingresoBodega.nroIdentificacion = reader.GetString(29);
                            ingresoBodega.correo = reader.GetString(30);
                            ingresoBodega.direccion = reader.GetString(31);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new IngresoBodegaDetalleViewModel
                                {
                                    detalle = new IngresoBodegaDetalle
                                    {
                                        idIngresoBodegaDetalle = reader.GetInt64(0),
                                        idBodega = reader.GetInt32(1),
                                        idArticulo = reader.GetInt32(2),
                                        idMedida = reader.GetInt32(3),
                                        descripcion = reader.GetString(4),
                                        cantidad = reader.GetDecimal(5),
                                        precioCosto = reader.GetDecimal(6),
                                        precioCostoNeto = reader.GetDecimal(7),
                                        porcentajeDescuento = reader.GetDecimal(8),
                                        valorDescuento = reader.GetDecimal(9),
                                        nota = reader.GetString(10),
                                        total = reader.GetDecimal(11),
                                        idTipoIva = reader.GetInt32(19),
                                    },
                                    codigo = reader.GetString(12),
                                    llevaInventario = reader.GetBoolean(13),
                                    nombreMedida = reader.GetString(14),
                                    nombreTipoIva = reader.GetString(15),
                                    codigoTipoIva = reader.GetString(16),
                                    ice = reader.GetDecimal(17),
                                    datosAdicionales = reader.GetBoolean(18),
                                };
                                detalle.Add(item);
                            }

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item1 = new ManejoArticuloDetalleViewModel()
                                {
                                    detalle = new ManejoArticuloDetalle
                                    {
                                        idManejoArticuloDetalle = reader.GetInt32(0),
                                        idManejoArticulo = reader.GetInt32(1),
                                        idEtiqueta = reader.GetInt32(2),
                                        descripcion = reader.GetString(3),
                                        secuencial = reader.GetInt32(4),
                                    },
                                    idArticulo = reader.GetInt32(5)
                                };
                                adicional.Add(item1);
                            }
                        }
                    }
                }

                data.ingresoBodega = ingresoBodega;
                data.detalle = detalle;
                data.adicional = adicional;
                _gr.data = data;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Id Ingreso a Bodega";

            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, IngresoBodegaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.IngresoBodega_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var ingBodega = JsonConvert.SerializeObject(data.ingresoBodega); cmd.Parameters.Add(new SqlParameter("jsonIngresoBodega", ingBodega));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                    var adicional = JsonConvert.SerializeObject(data.manejoArticuloDetalle); cmd.Parameters.Add(new SqlParameter("jsonManejoArticuloDetalle", adicional));
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
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Ingreso Bodega";

            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idIngresoBodega, IngresoBodegaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.IngresoBodega_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idIngresoBodega", idIngresoBodega);
                    var ingBodega = JsonConvert.SerializeObject(data.ingresoBodega); cmd.Parameters.Add(new SqlParameter("jsonIngresoBodega", ingBodega));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                    var adicional = JsonConvert.SerializeObject(data.manejoArticuloDetalle); cmd.Parameters.Add(new SqlParameter("jsonManejoArticuloDetalle", adicional));
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
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Ingreso Bodega";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idIngresoBodega)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.IngresoBodega_Delete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idIngresoBodega", idIngresoBodega);
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
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar Ingreso Bodega";
            }
            finally
            {

            }
            return _gr;
        }

    }
}
