using Domain.Models.Compras;
using Domain.ViewModels.Compras;
using Helpers;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.Compras
{
    public class FacturaCompraDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public FacturaCompraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetIdAsync(int idRol, int idFacturaCompra)
        {
            var facturaCompra = new FacturaCompraViewModel();
            var detalle = new List<FacturaCompraDetalleViewModel>();
            var adicional = new List<ManejoArticuloDetalleViewModel>();
            var data = new FacturaCompraData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Factura_Get_Id", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFacturaCompra", idFacturaCompra);
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
                            facturaCompra.factura = new FacturaCompra()
                            {
                                idFacturaCompra = reader.GetInt64(3),
                                idSustentoTributario = reader.GetInt32(4),
                                idProveedor = reader.GetInt32(5),
                                idSucursal = reader.GetInt32(6),
                                idCategoriaCompra = reader.GetInt32(7),
                                idTiempoCredito = reader.GetInt32(8),
                                nroDocumento = reader.GetInt64(9),
                                nroAutorizacion = reader.GetString(10),
                                fechaEmision = reader.GetDateTime(11).ToString("yyyy-MM-dd"),
                                fechaVencimiento = reader.GetDateTime(12).ToString("yyyy-MM-dd"),
                                subTotalSinImpuestos = reader.GetDecimal(13),
                                subTotalIva = reader.GetDecimal(14),
                                subTotalNetoIva = reader.GetDecimal(15),
                                subTotalIvaCero = reader.GetDecimal(16),
                                subTotalNetoIvaCero = reader.GetDecimal(17),
                                subTotalNoObjetoIva = reader.GetDecimal(18),
                                subTotalNetoNoObjetoIva = reader.GetDecimal(19),
                                subTotalExentoIva = reader.GetDecimal(20),
                                subTotalNetoExentoIva = reader.GetDecimal(21),
                                totalDescuento = reader.GetDecimal(22),
                                porcentajeDescuento = reader.GetDecimal(23),
                                totalIce = reader.GetDecimal(24),
                                irbpnr = reader.GetDecimal(25),
                                propina = reader.GetDecimal(26),
                                iva = reader.GetDecimal(27),
                                recargo = reader.GetDecimal(28),
                                transporte = reader.GetDecimal(29),
                                total = reader.GetDecimal(30),
                                observacion = reader.GetString(31),
                                puntoEmision = reader.GetString(32)
                            };
                            facturaCompra.nombreFiscal = reader.GetString(33);
                            facturaCompra.nroIdentificacion = reader.GetString(34);
                            facturaCompra.correo = reader.GetString(35);
                            facturaCompra.direccion = reader.GetString(36);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new FacturaCompraDetalleViewModel
                                {
                                    detalle = new FacturaCompraDetalle()
                                    {
                                        idFacturaCompraDetalle = reader.GetInt64(0),
                                        idBodega = reader.GetInt32(1),
                                        idArticulo = reader.GetInt32(2),
                                        idMedida = reader.GetInt32(3),
                                        idTipoIva = reader.GetInt32(4),
                                        descripcion = reader.GetString(5),
                                        cantidad = reader.GetDecimal(6),
                                        precioCosto = reader.GetDecimal(7),
                                        precioCostoNeto = reader.GetDecimal(8),
                                        porcentajeDescuento = reader.GetDecimal(9),
                                        valorDescuento = reader.GetDecimal(10),
                                        nota = reader.GetString(11),
                                        total = reader.GetDecimal(12)
                                    },
                                    codigo = reader.GetString(13),
                                    datosAdicionales = reader.GetBoolean(14),
                                    llevaInventario = reader.GetBoolean(15),
                                    nombreMedida = reader.GetString(16),
                                    nombreTipoIva = reader.GetString(17),
                                    codigoTipoIva = reader.GetString(18),
                                    ice = reader.GetDecimal(19)
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
                data.facturaCompra = facturaCompra;
                data.detalle = detalle;
                data.adicional = adicional;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get id Factura Compra";

            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idFacturaCompra, FacturaCompraViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Factura_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFacturaCompra", idFacturaCompra);
                    var factura = JsonConvert.SerializeObject(data.factura); cmd.Parameters.Add(new SqlParameter("jsonFactura", factura));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                    //     var manejoAdicionalDetalle = JsonConvert.SerializeObject(data.manejoArticuloDetalle); cmd.Parameters.Add(new SqlParameter("jsonManejoArticuloDetalle", manejoAdicionalDetalle));
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
                _gr.titleSms = "Actulizar Factura de Compra";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idFacturaCompra)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Factura_Delete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFacturaCompra", idFacturaCompra);
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
                _gr.titleSms = "Eliminar Factura de Compra";
            }
            finally
            {

            }
            return _gr;
        }


        public async Task<GenericResponse> GetForProveedorAsync(int idRol, int idProveedor)
        {
            var list = new List<FacturaCompraViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPFacturaCompraGetForProveedor", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProveedor", idProveedor);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);

                        if (_gr.id == "1")
                        {
                            var item = new FacturaCompraViewModel()
                            {
                                factura = new FacturaCompra
                                {
                                    idFacturaCompra = reader.GetInt64(2),
                                    idTipoDocumento = reader.GetInt64(3),
                                },
                                nroDocumento = reader.GetString(4),
                            };
                            list.Add(item);
                        }
                    }
                }
                _gr.data = list;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Documents Proveedor";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetDetailAsync(int idRol, int idFacturaCompra, int idSubContribuyente, int idConfiguracionContribuyente)
        {

            var detalle = new List<FacturaCompraDetalleViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPFacturaCompraGetDetail", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFacturaCompra", idFacturaCompra);
                    cmd.Parameters.AddWithValue("idSubContribuyente", idSubContribuyente);
                    cmd.Parameters.AddWithValue("idConfiguracionContribuyente", idConfiguracionContribuyente);
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
                            var item = new FacturaCompraDetalleViewModel
                            {
                                detalle = new FacturaCompraDetalle()
                                {
                                    idArticulo = reader.GetInt32(3),
                                    descripcion = reader.GetString(4),
                                    precioCostoNeto = reader.GetDecimal(5),
                                },
                                codigo = reader.GetString(6),
                                nombreTipoIva = reader.GetString(7),
                            };
                            detalle.Add(item);
                        }
                    }
                }
                _gr.data = detalle;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Getid Detail Factura Compra";

            }
            finally
            {

            }

            return _gr;
        }

    }
}
