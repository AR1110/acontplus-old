using System.Data;
using Microsoft.Data.SqlClient;
using Common.Core.Models;
using Domain.Models.CuotaDocumento;
using Domain.ViewModels.CuotaDocumento;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.CuotaDocumento
{
    public class CuotaXCobrarDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CuotaXCobrarDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> InsertAsync(int idRol, CuotaXCobrarViewModel data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCuotaxCobrarInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idComprobante", data.cxc.idComprobante);
                    cmd.Parameters.AddWithValue("idTipoDocumento", data.cxc.idTipoDocumento);
                    cmd.Parameters.AddWithValue("idTiempoCredito", data.idTiempoCredito); // el nuevo tiempo de Credito
                    cmd.Parameters.AddWithValue("fechaEmision", data.fechaEmision); // fecha de emision de la factura
                    cmd.Parameters.AddWithValue("total", data.total); // total de la factura
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
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
                _gr.titleSms = "Registrar Cuotas X Cobrar";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idComprobante, int idTipoDocumento)
        {
            var cuotas = new List<CuotaXCobrarViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCuotaXCobrarByDocument", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
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
                            var item = new CuotaXCobrarViewModel
                            {
                                cxc = new CuotaXCobrar()
                                {
                                    idCuotaXCobrar = reader.GetInt64(3),
                                    fechaVencimiento = reader.GetString(4),
                                    cuota = reader.GetDecimal(5),
                                    nroCuota = reader.GetInt32(6),
                                },
                                nroCuota = reader.GetString(7),
                                abono = reader.GetDecimal(8),
                                saldo = reader.GetDecimal(9),
                                abonoPosfechado = reader.GetDecimal(10),
                                xEfectivizar = reader.GetDecimal(11),
                                diasMoraView = reader.GetString(12),
                                totalMasInteres = reader.GetDecimal(13),
                                estadoFinanciero = reader.GetString(14),
                                codigoFinanciero = reader.GetString(15),
                            };

                            cuotas.Add(item);
                        }

                    }
                }
                _gr.data = cuotas;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Getby Document";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idComprobante, int idTipoDocumento, List<CuotaXCobrar> data)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCuotaxCobrarUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    var cuotas = JsonConvert.SerializeObject(data); cmd.Parameters.Add(new SqlParameter("jsonCuotas", cuotas));
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var reader = cmd.ExecuteReader();
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
                _gr.titleSms = "Actualizar CuotaXCobrar";
            }
            finally
            {

            }
            return _gr;
        }


        //Operaciones especiales. 
        public async Task<GenericResponse> GetByCobroAsync(int idRol, int idComprobante, int idTipoDocumento)
        {

            var cuotas = new List<CuotaXCobrarViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCuotaXCobrarByCobro", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
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
                            var item = new CuotaXCobrarViewModel
                            {
                                cxc = new CuotaXCobrar()
                                {
                                    idCuotaXCobrar = reader.GetInt64(3),
                                    fechaVencimiento = reader.GetString(4),
                                    cuota = reader.GetDecimal(5),
                                },
                                nroCuota = reader.GetString(6),
                                abono = reader.GetDecimal(7),
                                saldo = reader.GetDecimal(8),
                                abonoPosfechado = reader.GetDecimal(9),
                                xEfectivizar = reader.GetDecimal(10),
                                diasMoraView = reader.GetString(11),
                                totalMasInteres = reader.GetDecimal(12),
                                estadoFinanciero = reader.GetString(13),
                                codigoFinanciero = reader.GetString(14),
                            };

                            cuotas.Add(item);
                        }
                    }
                }
                _gr.data = cuotas;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Cuotas para cobros";
            }
            finally
            {

            }
            return _gr;
        }

    }

}


