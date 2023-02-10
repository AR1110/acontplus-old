using Helpers;
using Domain.Dtos;
using Domain.Models;
using Domain.Models.InfoAdicional;
using Domain.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Compras
{
    public class RetencionCompraDao
    {


        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public RetencionCompraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Retencion_Get", con);
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
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Retenciones";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idRetencionCompra)
        {
            var retencionData = new RetencionCompraViewModel();
            var detalleData = new List<RetencionCompraDetalleViewModel>();
            var infoAdicional = new List<InfoAdicionalDoc>();
            var data = new RetencionCompraData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Retencion_Get_Id", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idRetencionCompra", idRetencionCompra);
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

                            retencionData.retencionCompra = new RetencionCompra
                            {
                                idRetencionCompra = reader.GetInt64(3),
                                idFacturaCompra = reader.GetInt64(4),
                                idProveedor = reader.GetInt32(5),
                                idPuntoEmision = reader.GetInt32(6),
                                fechaEmision = reader.GetDateTime(7).ToString("yyyy-MM-dd"),
                                concepto = reader.GetString(8),
                                total = reader.GetDecimal(9),
                            };
                            retencionData.proveedor = reader.GetString(10);
                            retencionData.numeroIdentificacion = reader.GetString(11);
                            retencionData.nroFactura = reader.GetString(12);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new RetencionCompraDetalleViewModel
                                {
                                    retencionCompraDetalle = new RetencionCompraDetalle
                                    {
                                        idRetencionCompraDetalle = reader.GetInt64(0),
                                        idImpuesto = reader.GetInt32(1),
                                        idRetencion = reader.GetInt32(2),
                                        baseImponible = reader.GetDecimal(3),
                                        porcentajeRetencion = reader.GetDecimal(4),
                                        valorRetenido = reader.GetDecimal(5),
                                    },
                                    impuesto = reader.GetString(6),
                                    tipoRetencion = reader.GetString(7),
                                    codigoImpuesto = reader.GetString(8),
                                };
                                detalleData.Add(item);
                            }

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var itemInfoAdicional = new InfoAdicionalDoc()
                                {
                                    idInfoAdicionalDoc = reader.GetInt64(0),
                                    nombre = reader.GetString(1),
                                    valor = reader.GetString(2),
                                };
                                infoAdicional.Add(itemInfoAdicional);
                            }
                        }
                    }
                }
                data.retencionCompra = retencionData;
                data.dataDetalle = detalleData;
                data.infoAdicional = infoAdicional;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Retencion Compra";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, RetencionCompraViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Retencion_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idFacturaCompra", data.retencionCompra.idFacturaCompra);
                    cmd.Parameters.AddWithValue("idProveedor", data.retencionCompra.idProveedor);
                    cmd.Parameters.AddWithValue("idPuntoEmision", data.retencionCompra.idPuntoEmision);
                    cmd.Parameters.AddWithValue("total", data.retencionCompra.total);
                    cmd.Parameters.AddWithValue("fechaEmision", data.retencionCompra.fechaEmision);
                    cmd.Parameters.AddWithValue("concepto", DataHelper.ToDBNullOrDefault(data.retencionCompra.concepto));
                    var p = JsonConvert.SerializeObject(data.dataDetalle); cmd.Parameters.Add(new SqlParameter("json", p));
                    var infoAdicional = JsonConvert.SerializeObject(data.adicional); cmd.Parameters.Add(new SqlParameter("jsonInfoAdicional", infoAdicional));
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
                            _gr.lastId = reader.GetInt64(3);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Retencion de Compra";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, long idRetencionCompra, RetencionCompraViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("Compra.Retencion_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idRetencionCompra", idRetencionCompra);
                    cmd.Parameters.AddWithValue("idFacturaCompra", data.retencionCompra.idFacturaCompra);
                    cmd.Parameters.AddWithValue("idProveedor", data.retencionCompra.idProveedor);
                    cmd.Parameters.AddWithValue("total", data.retencionCompra.total);
                    cmd.Parameters.AddWithValue("fechaEmision", data.retencionCompra.fechaEmision);
                    cmd.Parameters.AddWithValue("concepto", DataHelper.ToDBNullOrDefault(data.retencionCompra.concepto));
                    var p = JsonConvert.SerializeObject(data.dataDetalle); cmd.Parameters.Add(new SqlParameter("json", p));
                    var infoAdicional = JsonConvert.SerializeObject(data.adicional); cmd.Parameters.Add(new SqlParameter("jsonInfoAdicional", infoAdicional));
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
                            _gr.lastId = reader.GetInt64(3);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Retención Fisica";
            }
            finally
            {

            }
            return _gr;




        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idRetencionCompra)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Retencion_Delete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idRetencionCompra", idRetencionCompra);
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
                _gr.titleSms = "Eliminar Retencion de Compra";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<object[]> DataSendEmailAsync(string json)
        {
            var send = new Email();
            var urlSri = "";
            var invoiceName = "";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Retencion_Send_Email", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        if (_gr.id == "1")
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
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {

            }
            return new object[] { send, urlSri, invoiceName };
        }
    }
}
