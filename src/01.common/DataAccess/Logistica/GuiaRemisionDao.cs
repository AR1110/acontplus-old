using Domain.Models;
using Domain.Models.InfoAdicional;
using Domain.Models.Logistica;
using Domain.ViewModels.Logistica;
using Helpers;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Logistica
{
    public class GuiaRemisionDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public GuiaRemisionDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetIdAsync(int idRol, int idGuiaRemision)
        {
            var guia = new GuiaRemisionViewModel();
            var detalle = new List<GuiaRemisionDetalleViewModel>();
            var infoAdicional = new List<InfoAdicionalDoc>();
            var data = new GuiaRemisionData();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Logistica.GuiaRemision_Get_Id", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idGuiaRemision", idGuiaRemision);
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
                            guia.guia = new GuiaRemision()
                            {
                                idGuiaRemision = reader.GetInt64(3),
                                idCliente = reader.GetInt32(4),
                                idTransportista = reader.GetInt32(5),
                                idVehiculo = reader.GetInt32(6),
                                idEmpleado = reader.GetInt32(7),
                                fechaEmision = reader.GetDateTime(8).ToString("yyyy-MM-dd"),
                                fechaInicio = reader.GetDateTime(9).ToString("yyyy-MM-dd"),
                                fechaFin = reader.GetDateTime(10).ToString("yyyy-MM-dd"),
                                docAduanero = reader.GetString(11),
                                ptoPartida = reader.GetString(12),
                                ptoLlegada = reader.GetString(13),
                                ruta = reader.GetString(14),
                                estableDestino = reader.GetString(15),
                                entregar = reader.GetString(16),
                                motivo = reader.GetString(17),

                            };

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new GuiaRemisionDetalleViewModel()
                                {
                                    detalle = new GuiaRemisionDetalle()
                                    {
                                        idGuiaRemisionDetalle = reader.GetInt64(0),
                                        idArticulo = reader.GetInt32(1),
                                        cantidad = reader.GetDecimal(2),
                                        descripcion = reader.GetString(3)
                                    },
                                    codigo = reader.GetString(4),

                                };
                                detalle.Add(item);
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
                data.guia = guia;
                data.detalle = detalle;
                data.infoAdicional = infoAdicional;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Id";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, GuiaRemisionViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Logistica.GuiaRemision_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var guia = JsonConvert.SerializeObject(data.guia); cmd.Parameters.Add(new SqlParameter("jsonGuia", guia));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
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
                _gr.titleSms = "Registrar Guia Remision";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, long idGuiaRemision, GuiaRemisionViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Logistica.GuiaRemision_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idGuiaRemision", idGuiaRemision);
                    var guia = JsonConvert.SerializeObject(data.guia); cmd.Parameters.Add(new SqlParameter("jsonGuia", guia));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
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
                _gr.titleSms = "Actualizar Guia Remision";
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
                    var cmd = new SqlCommand("Logistica.GuiaRemision_Send_Email", con);
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
