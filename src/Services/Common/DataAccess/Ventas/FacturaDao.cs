using System.Data;
using System.Data.SqlClient;
using Domain.Models.InfoAdicional;
using Domain.Models.Ventas;
using Domain.ViewModels.InfoAdicional;
using Domain.ViewModels.Ventas;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Ventas
{
    public class FacturaDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public FacturaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idFactura)
        {
            var factura = new FacturaViewModel();
            var detalle = new List<FacturaDetalleViewModel>();
            var infoAdicional = new List<InfoAdicionalDocViewModel>();
            var data = new FacturaData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Factura_Get_Id", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFactura", idFactura);
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
                            factura.factura = new Factura()
                            {
                                idFactura = (int)reader.GetInt64(3),
                                idCliente = reader.GetInt32(4),
                                idPuntoEmision = reader.GetInt32(5),
                                idTiempoCredito = reader.GetInt32(6),
                                nroFactura = (int)reader.GetInt64(7),
                                fechaEmision = reader.GetDateTime(8).ToString("yyyy-MM-dd"),
                                fechaVencimiento = reader.GetDateTime(9).ToString("yyyy-MM-dd"),
                                subTotalSinImpuestos = reader.GetDecimal(10),
                                subTotalIva = reader.GetDecimal(11),
                                subTotalNetoIva = reader.GetDecimal(12),
                                subTotalIvaCero = reader.GetDecimal(13),
                                subTotalNetoIvaCero = reader.GetDecimal(14),
                                subTotalNoObjetoIva = reader.GetDecimal(15),
                                subTotalNetoNoObjetoIva = reader.GetDecimal(16),
                                subTotalExentoIva = reader.GetDecimal(17),
                                subTotalNetoExentoIva = reader.GetDecimal(18),
                                totalDescuento = reader.GetDecimal(19),
                                porcentajeDescuento = reader.GetDecimal(20),
                                totalIce = reader.GetDecimal(21),
                                irbpnr = reader.GetDecimal(22),
                                propina = reader.GetDecimal(23),
                                iva = reader.GetDecimal(24),
                                recargo = reader.GetDecimal(25),
                                transporte = reader.GetDecimal(26),
                                total = reader.GetDecimal(27),
                                observacion = reader.GetString(28),
                                placa = reader.GetString(34),
                                idSucursal = reader.GetInt32(35),
                            };
                            factura.nombreFiscal = reader.GetString(29);
                            factura.nroIdentificacion = reader.GetString(30);
                            factura.direccion = reader.GetString(31);
                            factura.correo = reader.GetString(32);
                            factura.telefono = reader.GetString(33);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new FacturaDetalleViewModel
                                {
                                    detalle = new FacturaDetalle()
                                    {
                                        idFacturaDetalle = (int)reader.GetInt64(0),
                                        cantidad = reader.GetDecimal(1),
                                        precioVenta = reader.GetDecimal(2),
                                        precioConIva = reader.GetDecimal(3),
                                        valorDescuento = reader.GetDecimal(4),
                                        porcentajeDescuento = reader.GetDecimal(5),
                                        total = reader.GetDecimal(6),
                                        nota = reader.GetString(7),
                                        idArticulo = reader.GetInt32(8),
                                        idBodega = reader.GetInt32(9),
                                        idTarifa = reader.GetInt32(10),
                                        idMedida = reader.GetInt32(11),
                                        descripcion = reader.GetString(12),
                                        ice = reader.GetDecimal(13),
                                        idTipoIva = reader.GetInt32(14),
                                    },
                                    codigo = reader.GetString(15),
                                    nombreMedida = reader.GetString(16),
                                    nombreTipoIva = reader.GetString(17),
                                    codigoTipoIva = reader.GetString(18),
                                    porcentajeTipoIva = reader.GetDecimal(19),
                                    datosAdicionales = reader.GetBoolean(20),
                                };
                                detalle.Add(item);
                            }

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item2 = new InfoAdicionalDocViewModel()
                                {
                                    adicional = new InfoAdicionalDoc
                                    {
                                        idInfoAdicionalDoc = reader.GetInt64(0),
                                        nombre = reader.GetString(1),
                                        valor = reader.GetString(2),
                                        estado = reader.GetBoolean(3),
                                    },
                                    conjunto = reader.GetInt64(4),
                                    idArticulo = reader.GetInt32(5),
                                };
                                infoAdicional.Add(item2);
                            }


                        }

                    }
                }
                data.factura = factura;
                data.detalle = detalle;
                data.infoAdicional = infoAdicional;
                _gr.data = data;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Factura";
            }
            finally
            {

            }
            return _gr;
        }
    }
}

