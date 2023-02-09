using Helpers;
using Domain.Models;
using Domain.Models.Compras;
using Domain.ViewModels.Compras;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Compras
{
    public class NotaCreditoProveedorDao : ConnectionDb
    {
        private GenericResponse _gr;

        public NotaCreditoProveedorDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                var cmd = new SqlCommand("Compra.NotaCredito_Get", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                dataAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    _gr.id = "1";
                    _gr.data = DataHelper.DataTableToJSON(dt);
                }

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Nota de Credito Proveedor";

            }
            finally
            {
                con.Close();
            }

            return _gr;

        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idNotaCreditoProveedor)
        {
            var notaCredito = new NotaCreditoProveedorViewModel();
            var detalle = new List<NotaCreditoProveedorDetalleViewModel>();
            var data = new NotaCreditoProveedorData();

            try
            {
                var cmd = new SqlCommand("Compra.NotaCredito_GetId", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idNotaCreditoProveedor", idNotaCreditoProveedor);
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
                        notaCredito.notaCredito = new NotaCreditoProveedor()
                        {
                            idNotaCreditoProveedor = reader.GetInt64(3),
                            idFacturaCompra = reader.GetInt64(4),
                            idProveedor = reader.GetInt32(5),
                            idSucursal = reader.GetInt32(6),
                            nroAutho = reader.GetString(7),
                            fechaEmision = reader.GetDateTime(8).ToString("yyyy-MM-dd"),
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
                            ptoEmision = reader.GetString(28),
                            nroDoc = reader.GetInt64(29),
                        };
                        notaCredito.nombreFiscal = reader.GetString(30);
                        notaCredito.nroIdentificacion = reader.GetString(31);
                        notaCredito.correo = reader.GetString(32);
                        notaCredito.direccion = reader.GetString(33);

                        reader.NextResult();
                        while (reader.Read())
                        {
                            var item = new NotaCreditoProveedorDetalleViewModel
                            {
                                detalle = new NotaCreditoProveedorDetalle()
                                {
                                    idNotaCreditoProveedorDetalle = reader.GetInt64(0),
                                    idBodega = reader.GetInt32(1),
                                    idArticulo = reader.GetInt32(2),
                                    idTipoIva = reader.GetInt32(3),
                                    idMedida = reader.GetInt32(4),
                                    descripcion = reader.GetString(5),
                                    cantidad = reader.GetDecimal(6),
                                    precioUnitario = reader.GetDecimal(7),
                                    precioCostoNeto = reader.GetDecimal(8),
                                    porcentajeDescuento = reader.GetDecimal(9),
                                    valorDescuento = reader.GetDecimal(10),
                                    nota = reader.GetString(11),
                                    total = reader.GetDecimal(12)
                                },
                                codigo = reader.GetString(13),
                                nombreMedida = reader.GetString(14),
                                nombreTipoIva = reader.GetString(15),
                                codigoTipoIva = reader.GetString(16),
                                porcentajeTipoIva = reader.GetDecimal(17),
                                ice = reader.GetDecimal(18)
                            };
                            detalle.Add(item);
                        }
                    }

                }
                data.notaCredito = notaCredito;
                data.detalle = detalle;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get id Nota de Credito";

            }
            finally
            {
                con.Close();
            }

            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, NotaCreditoProveedorViewModel data)
        {
            try
            {
                var cmd = new SqlCommand("Compra.NotaCredito_Insert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                var notaCredito = JsonConvert.SerializeObject(data.notaCredito); cmd.Parameters.Add(new SqlParameter("jsonNotaCredito", notaCredito));
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
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Nota de Credito Proveedor";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idNotaCreditoProveedor, NotaCreditoProveedorViewModel data)
        {
            try
            {
                var cmd = new SqlCommand("Compra.NotaCredito_Update", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idNotaCreditoProveedor", idNotaCreditoProveedor);
                var notaCredito = JsonConvert.SerializeObject(data.notaCredito); cmd.Parameters.Add(new SqlParameter("jsonNotaCredito", notaCredito));
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
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actulizar Nota de Credito Proveedor";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idNotaCreditoProveedor)
        {
            try
            {
                var cmd = new SqlCommand("Compra.NotaCredito_Delete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idNotaCreditoProveedor", idNotaCreditoProveedor);
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
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar Nota de Credito Proveedor";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
