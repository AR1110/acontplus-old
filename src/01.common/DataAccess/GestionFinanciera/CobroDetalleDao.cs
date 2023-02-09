using Domain.Models;
using Domain.Models.Tesoreria;
using Domain.ViewModels.Tesoreria;
using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Tesoreria
{
    public class CobroDetalleDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CobroDetalleDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idCobro, int idTipoDocumento, int idComprobante)
        {
            var detalle = new List<CobroDetalleViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCobroDetalleByDocument", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCobro", idCobro);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
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
                            var item = new CobroDetalleViewModel()
                            {
                                cobroDetalle = new CobroDetalle()
                                {
                                    idCobroDetalle = reader.GetInt64(3),
                                    abono = reader.GetDecimal(4),
                                },
                                nroCuota = reader.GetString(5),
                                cuota = reader.GetDecimal(6),
                                mora = reader.GetDecimal(7),
                                saldo = reader.GetDecimal(8),
                                saldoAnterior = reader.GetDecimal(9),
                                fechaVencimiento = reader.GetString(10),
                            };
                            detalle.Add(item);
                        }
                    }
                }
                _gr.data = detalle;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetBy Cobro";
            }
            finally
            {
                
            }
            return _gr;
        }

        public async Task<GenericResponse> GetByCobroAsync(int idRol, int idCobro)
        {
            var detalle = new List<CobroDetalleViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCobroDetalleByCobro", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCobro", idCobro);
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
                            var item = new CobroDetalleViewModel()
                            {
                                cobroDetalle = new CobroDetalle()
                                {
                                    idCobroDetalle = reader.GetInt64(3),
                                    abono = reader.GetDecimal(4),
                                },
                                nroCuota = reader.GetString(5),
                                cuota = reader.GetDecimal(6),
                                mora = reader.GetDecimal(7),
                                saldo = reader.GetDecimal(8),
                                fechaVencimiento = reader.GetString(9),
                                nroDoc = reader.GetString(10),
                                tipDoc = reader.GetString(11),
                            };
                            detalle.Add(item);
                        }
                    }
                }
                _gr.data = detalle;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetBy Cobro";
            }
            finally
            {
                
            }
            return _gr;
        }
    }
}
