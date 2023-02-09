using Helpers;
using Domain.Dtos;
using Domain.Models;
using Domain.Models.Compras;
using Domain.Models.InfoAdicional;
using Domain.ViewModels.Compras;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Compras
{
    public class LiquidacionCompraDao : ConnectionDb
    {

        private GenericResponse _response;

        public LiquidacionCompraDao()
        {
            _response = new GenericResponse();

        }
        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                var cmd = new SqlCommand("Compra.Liquidacion_Get", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                dataAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    _response.id = "1";
                    _response.data = DataHelper.DataTableToJSON(dt);
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Listar Liquidacion de Compra";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idLiquidacionCompra)
        {
            var liquidacion = new LiquidacionCompraViewModel();
            var detalle = new List<LiquidacionCompraDetalleViewModel>();
            var infoAdicional = new List<InfoAdicionalDoc>();
            var data = new LiquidacionCompraData();

            try
            {
                var cmd = new SqlCommand("Compra.Liquidacion_Get_Id", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idLiquidacionCompra", idLiquidacionCompra);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                    if (_response.id == "1")
                    {
                        liquidacion.liquidacion = new LiquidacionCompra()
                        {
                            idLiquidacionCompra = reader.GetInt64(3),
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
                        liquidacion.nombreFiscal = reader.GetString(28);
                        liquidacion.nroIdentificacion = reader.GetString(29);
                        liquidacion.correo = reader.GetString(30);
                        liquidacion.direccion = reader.GetString(31);

                        reader.NextResult();
                        while (reader.Read())
                        {
                            var item = new LiquidacionCompraDetalleViewModel
                            {
                                detalle = new LiquidacionCompraDetalle()
                                {
                                    idLiquidacionCompraDetalle = reader.GetInt64(0),
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
                                    idTipoIva = reader.GetInt32(17)
                                },
                                codigo = reader.GetString(11),
                                llevaInventario = reader.GetBoolean(12),
                                nombreMedida = reader.GetString(13),
                                nombreTipoIva = reader.GetString(14),
                                codigoTipoIva = reader.GetString(15),
                                ice = reader.GetDecimal(16)
                            };
                            detalle.Add(item);
                        }

                        reader.NextResult();
                        while (reader.Read())
                        {
                            var itemAdicional = new InfoAdicionalDoc()
                            {
                                idInfoAdicionalDoc = reader.GetInt64(0),
                                nombre = reader.GetString(1),
                                valor = reader.GetString(2),
                            };
                            infoAdicional.Add(itemAdicional);
                        }

                    }
                }

                data.liquidacion = liquidacion;
                data.detalle = detalle;
                data.infoAdicional = infoAdicional;
                _response.data = data;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Get Id liquidacion Compra";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, LiquidacionCompraViewModel data)
        {
            try
            {
                var cmd = new SqlCommand("Compra.Liquidacion_Insert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                var liquidacion = JsonConvert.SerializeObject(data.liquidacion); cmd.Parameters.Add(new SqlParameter("jsonLiquidacion", liquidacion));
                var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                var infoAdicional = JsonConvert.SerializeObject(data.adicional); cmd.Parameters.Add(new SqlParameter("jsonInfoAdicional", infoAdicional));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                    if (_response.id == "1")
                    {
                        _response.lastId = reader.GetInt64(3);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Registrar Liquidacion de Compra";
            }
            finally
            {
                con.Close();
            }

            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, long idLiquidacionCompra, LiquidacionCompraViewModel data)
        {
            try
            {
                var cmd = new SqlCommand("Compra.Liquidacion_Update", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idLiquidacionCompra", idLiquidacionCompra);
                var liquidacion = JsonConvert.SerializeObject(data.liquidacion); cmd.Parameters.Add(new SqlParameter("jsonLiquidacion", liquidacion));
                var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                var infoAdicional = JsonConvert.SerializeObject(data.adicional); cmd.Parameters.Add(new SqlParameter("jsonInfoAdicional", infoAdicional));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                    if (_response.id == "1")
                    {
                        _response.lastId = reader.GetInt64(3);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Actualizar Liquidacion de Compra";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idLiquidacionCompra)
        {
            try
            {
                var cmd = new SqlCommand("Compra.Liquidacion_Delete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idLiquidacionCompra", idLiquidacionCompra);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);

                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Eliminar Liquidacion de Compra";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<object[]> DataSendEmailAsync(string json)
        {
            var send = new Email();
            var urlSri = "";
            var invoiceName = "";
            try
            {
                var cmd = new SqlCommand("Compra.Liquidacion_Send_Email", con);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    if (_response.id == "1")
                    {
                        send = new Email()
                        {
                            from = reader.GetString(2),
                            password = reader.GetString(3),
                            to = reader.GetString(4),
                            subject = reader.GetString(5),
                            message = reader.GetString(6),
                            cc = reader.GetString(7),
                        };
                        urlSri = reader.GetString(8);
                        invoiceName = reader.GetString(9);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
            }
            finally
            {
                con.Close();
            }
            return new object[] { send, urlSri, invoiceName };
        }
    }
}
