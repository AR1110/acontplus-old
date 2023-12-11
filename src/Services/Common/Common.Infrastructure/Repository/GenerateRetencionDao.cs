using System.Data;
using Common.Core.Models;
using Common.Core.Models.Ventas;
using Common.Core.ViewModels;
using Common.Core.ViewModels.Ventas;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class GenerateRetencionDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public GenerateRetencionDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetPurchaseAsync(int idRol, int idFacturaCompra)
        {
            var listar = new List<RetencionCompraDetalleViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspRetencionCompraGenerate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFacturaCompra", idFacturaCompra);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new RetencionCompraDetalleViewModel
                            {
                                retencionCompraDetalle = new RetencionCompraDetalle
                                {
                                    idImpuesto = reader.GetInt32(3),
                                    idRetencion = reader.GetInt32(4),
                                    baseImponible = reader.GetDecimal(5),
                                    porcentajeRetencion = reader.GetDecimal(6),
                                    valorRetenido = reader.GetDecimal(7),
                                },
                                codigoRetencion = reader.GetInt32(8),
                                tipoRetencion = reader.GetString(9),
                                impuesto = reader.GetString(10),
                                codigoImpuesto = reader.GetString(11)
                            };
                            listar.Add(item);

                        }
                        if (_gr.id == "2")
                        {
                            _gr.gestion = reader.GetInt32(3);
                            _gr.lastId = reader.GetInt32(4);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Retencion Factura Compra";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> GetSaleAsync(int idRol, int idTipoDocumento, int idComprobante)
        {
            var listar = new List<RetencionVentaDetalleViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspRetencionVentaGenerate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new RetencionVentaDetalleViewModel
                            {
                                detalle = new RetencionVentaDetalle
                                {
                                    idImpuesto = reader.GetInt32(3),
                                    idRetencion = reader.GetInt32(4),
                                    baseImponible = reader.GetDecimal(5),
                                    porcentajeRetencion = reader.GetDecimal(6),
                                    valorRetenido = reader.GetDecimal(7),
                                },
                                codigoSri = reader.GetInt32(8),
                                tipoImpuesto = reader.GetString(9),
                                impuesto = reader.GetString(10),
                                codigoImpuesto = reader.GetString(11)
                            };
                            listar.Add(item);

                        }
                        if (_gr.id == "2")
                        {
                            _gr.gestion = reader.GetInt32(3);
                            _gr.lastId = reader.GetInt32(4);
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Retencion Factura Venta";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> GetTipoImpuestoAsync(int idRol, string busqueda)
        {
            var listar = new List<RetencionCompraDetalleViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPTipoImpuestoGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("busqueda", busqueda);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new RetencionCompraDetalleViewModel
                            {
                                retencionCompraDetalle = new RetencionCompraDetalle
                                {
                                    idImpuesto = reader.GetInt32(3),
                                    idRetencion = reader.GetInt32(4),
                                    porcentajeRetencion = reader.GetDecimal(5),
                                },
                                impuesto = reader.GetString(6),
                                tipoRetencion = reader.GetString(7),
                                icono = reader.GetString(8),
                                codigoImpuesto = reader.GetString(9),
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
                _gr.titleSms = "Listar Retencion de Compra Manual";
            }
            finally
            {

            }

            return _gr;
        }

    }
}
