using System.Data;
using Common.Core.Models;
using Common.Core.Models.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.GestionFinanciera
{
    public class GestionFinancieraDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public GestionFinancieraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }


        // Documentos para Cobros
        public async Task<GenericResponse> GetDocumentsChargeAsync(int idRol, int idCliente)
        {
            var documents = new List<Documento>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPDocumentsCharge", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCliente", idCliente);
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
                            var item = new Documento()
                            {
                                idComprobante = (int)reader.GetInt64(3),
                                idTipoDocumento = (int)reader.GetInt64(4),
                                fechaEmision = reader.GetString(5),
                                fechaVencimiento = reader.GetString(6),
                                nroDocumento = reader.GetString(7),
                                total = reader.GetDecimal(8),
                                estadoFinanciero = reader.GetString(9),
                                codigoColor = reader.GetString(10),
                                abono = reader.GetDecimal(11),
                                saldo = reader.GetDecimal(12),
                                tipoDocumento = reader.GetString(13)
                            };
                            documents.Add(item);
                        }
                    }
                }
                _gr.data = documents;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Documentos de Venta";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> GetChargeForDocumentAsync(int idRol, string json)
        {
            var documents = new List<Documento>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPDocumentsForCharge", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", json);
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
                            var item = new Documento()
                            {
                                idComprobante = (int)reader.GetInt64(3),
                                idTipoDocumento = (int)reader.GetInt64(4),
                                nroDocumento = reader.GetString(5),
                                total = reader.GetDecimal(6),
                                tipoDocumento = reader.GetString(7),
                                nroFactura = reader.GetString(8),
                            };
                            documents.Add(item);
                        }
                    }
                }
                _gr.data = documents;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Documentos para abono de cobros";
            }
            finally
            {

            }
            return _gr;

        }

        //Documentos para pagos 
        public async Task<GenericResponse> GetDocumentsPayAsync(int idRol, string json)
        {
            var documents = new List<Documento>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPDocumentsPay", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", json);
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
                            var item = new Documento()
                            {
                                idComprobante = (int)reader.GetInt64(3),
                                idTipoDocumento = (int)reader.GetInt64(4),
                                fechaEmision = reader.GetString(5),
                                fechaVencimiento = reader.GetString(6),
                                nroDocumento = reader.GetString(7),
                                total = reader.GetDecimal(8),
                                estadoFinanciero = reader.GetString(9),
                                codigoColor = reader.GetString(10),
                                abono = reader.GetDecimal(11),
                                saldo = reader.GetDecimal(12),
                                tipoDocumento = reader.GetString(13)
                            };
                            documents.Add(item);
                        }
                    }
                }
                _gr.data = documents;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Documentos de Compra";
            }
            finally
            {

            }

            return _gr;
        }
        public async Task<GenericResponse> GetPaymentForDocumentAsync(int idRol, int idProveedor)
        {
            var documents = new List<Documento>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPDocumentsForPayment", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProveedor", idProveedor);
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
                            var item = new Documento()
                            {
                                idComprobante = (int)reader.GetInt64(3),
                                idTipoDocumento = (int)reader.GetInt64(4),
                                nroDocumento = reader.GetString(5),
                                total = reader.GetDecimal(6),
                                tipoDocumento = reader.GetString(7)
                            };
                            documents.Add(item);
                        }
                    }
                }
                _gr.data = documents;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Documentos para abono de pagos";
            }
            finally
            {

            }
            return _gr;
        }
    }
}
