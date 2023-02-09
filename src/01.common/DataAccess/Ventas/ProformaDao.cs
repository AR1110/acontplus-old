using Helpers;
using Domain.Models;
using Domain.Models.Ventas;
using Domain.ViewModels.Ventas;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Ventas
{
    public class ProformaDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ProformaDao(IConfiguration config)
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
                    var cmd = new SqlCommand("Ventas.Proforma_Get", con);
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
                _gr.titleSms = "Get Proforma";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idProforma)
        {
            var proforma = new ProformaViewModel();
            var detalle = new List<ProformaDetalleViewModel>();
            var data = new ProformaData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Proforma_GetId", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProforma", idProforma);
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
                            proforma.proforma = new Proforma()
                            {
                                idProforma = (int)reader.GetInt64(3),
                                idCliente = reader.GetInt32(4),
                                idPuntoEmision = reader.GetInt32(5),
                                fechaEmision = reader.GetDateTime(6).ToString("yyyy-MM-dd"),
                                subTotalSinImpuestos = reader.GetDecimal(7),
                                subTotalIva = reader.GetDecimal(8),
                                subTotalNetoIva = reader.GetDecimal(9),
                                subTotalIvaCero = reader.GetDecimal(10),
                                subTotalNetoIvaCero = reader.GetDecimal(11),
                                subTotalNoObjetoIva = reader.GetDecimal(12),
                                subTotalNetoNoObjetoIva = reader.GetDecimal(13),
                                subTotalExentoIva = reader.GetDecimal(14),
                                subTotalNetoExentoIva = reader.GetDecimal(15),
                                totalDescuento = reader.GetDecimal(16),
                                porcentajeDescuento = reader.GetDecimal(17),
                                totalIce = reader.GetDecimal(18),
                                irbpnr = reader.GetDecimal(19),
                                propina = reader.GetDecimal(20),
                                iva = reader.GetDecimal(21),
                                recargo = reader.GetDecimal(22),
                                transporte = reader.GetDecimal(23),
                                total = reader.GetDecimal(24),
                                observacion = reader.GetString(25)
                            };
                            proforma.nombreFiscal = reader.GetString(26);
                            proforma.nroIdentificacion = reader.GetString(27);
                            proforma.direccion = reader.GetString(28);
                            proforma.correo = reader.GetString(29);
                            proforma.telefono = reader.GetString(30);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new ProformaDetalleViewModel
                                {
                                    detalle = new ProformaDetalle()
                                    {
                                        idProformaDetalle = reader.GetInt64(0),
                                        cantidad = reader.GetDecimal(1),
                                        precioUnitario = reader.GetDecimal(2),
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
                                        idTipoIva = reader.GetInt32(18),
                                        idPresentacion = reader.GetInt32(19),
                                    },
                                    codigo = reader.GetString(14),
                                    nombreMedida = reader.GetString(15),
                                    nombreTipoIva = reader.GetString(16),
                                    codigoTipoIva = reader.GetString(17),
                                    presentacion = reader.GetString(20),
                                    porcentajeTipoIva = reader.GetDecimal(21),
                                };

                                detalle.Add(item);
                            }

                        }
                    }
                }
                data.proforma = proforma;
                data.detalle = detalle;
                _gr.data = data;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Proforma";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, ProformaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Proforma_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var proforma = JsonConvert.SerializeObject(data.proforma); cmd.Parameters.Add(new SqlParameter("jsonProforma", proforma));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
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
                _gr.titleSms = "Registrar Proforma";

            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idProforma, ProformaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Proforma_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProforma", idProforma);
                    var proforma = JsonConvert.SerializeObject(data.proforma); cmd.Parameters.Add(new SqlParameter("jsonProforma", proforma));
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
                _gr.titleSms = "Actualizar Proforma";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idProforma)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Proforma_Delete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProforma", idProforma);
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
                _gr.titleSms = "Eliminar Proforma";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> ConvertAsync(int idRol, string tipDoc, int idProforma, int idTiempoCredito)
        {
            string storedProcedure = "Ventas.Proforma_ConvertFactura";
            if (tipDoc == "NE")
            {
                storedProcedure = "Ventas.Proforma_ConvertNotaEntrega";
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand(storedProcedure, con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProforma", idProforma);
                    cmd.Parameters.AddWithValue("idTiempoCredito", idTiempoCredito);
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
                _gr.titleSms = "Convertir Proforma / NotaEntrega";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<object[]> DataSendEmailAsync(string json)
        {
            var send = new Email();
            var invoiceName = "";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Proforma_SendEmail", con);
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
                            invoiceName = reader.GetString(8);
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
            return new object[] { send, invoiceName };
        }
    }
}
