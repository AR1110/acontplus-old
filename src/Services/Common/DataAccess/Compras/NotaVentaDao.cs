using System.Data;
using System.Data.SqlClient;
using Domain.Models.Compras;
using Domain.ViewModels.Compras;
using Lib.Common;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.Compras
{
    public class NotaVentaDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public NotaVentaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> InsertAsync(int idRol, NotaVentaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPNotaVentaInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var notaVenta = JsonConvert.SerializeObject(data.notaVenta); cmd.Parameters.Add(new SqlParameter("jsonNotaVenta", notaVenta));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
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
                _gr.titleSms = "Registrar Nota Venta";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var notas = new List<NotaVentaViewModel>();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPNotaVentaGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
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
                            var item = new NotaVentaViewModel();
                            item.notaVenta = new NotaVenta()
                            {
                                idNotaVenta = reader.GetInt64(3),
                                fechaEmision = reader.GetString(4),
                                fechaVencimiento = reader.GetString(5),
                                total = reader.GetDecimal(6),
                            };
                            item.nroDocumento = reader.GetString(7);
                            item.nombreFiscal = reader.GetString(8);
                            item.estadoFinanciero = reader.GetString(9);
                            notas.Add(item);
                        }
                    }
                }
                _gr.data = notas;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Nota Venta";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idNotaVenta, NotaVentaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPNotaVentaUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idNotaVenta", idNotaVenta);
                    var notaVenta = JsonConvert.SerializeObject(data.notaVenta); cmd.Parameters.Add(new SqlParameter("jsonNotaVenta", notaVenta));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
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
                _gr.titleSms = "Actualizar Nota Venta";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idNotaVenta)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPNotaVentaDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idNotaVenta", idNotaVenta);
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
                _gr.titleSms = "Eliminar Nota Venta";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idNotaVenta)
        {
            var notaVenta = new NotaVentaViewModel();
            var detalle = new List<NotaVentaDetalleViewModel>();
            var data = new NotaVentaData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPNotaVentaGetId", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idNotaVenta", idNotaVenta);
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
                            notaVenta.notaVenta = new NotaVenta()
                            {
                                idNotaVenta = reader.GetInt64(3),
                                idProveedor = reader.GetInt32(4),
                                idSucursal = reader.GetInt32(5),
                                idCategoriaCompra = reader.GetInt32(6),
                                idTiempoCredito = reader.GetInt32(7),
                                puntoEmision = reader.GetString(8),
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
                            };
                            notaVenta.nombreFiscal = reader.GetString(32);
                            notaVenta.nroIdentificacion = reader.GetString(33);
                            notaVenta.correo = reader.GetString(34);
                            notaVenta.direccion = reader.GetString(35);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new NotaVentaDetalleViewModel();
                                item.detalle = new NotaVentaDetalle()
                                {
                                    idNotaVenta = reader.GetInt64(0),
                                    idBodega = reader.GetInt32(1),
                                    idArticulo = reader.GetInt32(2),
                                    descripcion = reader.GetString(3),
                                    cantidad = reader.GetDecimal(4),
                                    precioCosto = reader.GetDecimal(5),
                                    precioCostoNeto = reader.GetDecimal(6),
                                    porcentajeDescuento = reader.GetDecimal(7),
                                    valorDescuento = reader.GetDecimal(8),
                                    nota = reader.GetString(9)

                                };
                                item.codigo = reader.GetString(10);
                                item.llevaInventario = reader.GetBoolean(11);
                                item.nombreMedida = reader.GetString(12);
                                item.nombreTipoIva = reader.GetString(13);
                                item.codigoTipoIva = reader.GetString(14);
                                item.ice = reader.GetDecimal(15);
                                detalle.Add(item);
                            }
                        }
                    }
                }
                data.notaVenta = notaVenta;
                data.detalle = detalle;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Nota Venta";
            }
            finally
            {

            }

            return _gr;
        }
    }
}
