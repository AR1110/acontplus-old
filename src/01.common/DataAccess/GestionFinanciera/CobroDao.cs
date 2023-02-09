using Domain.Models;
using Domain.Models.Tesoreria;
using Domain.ViewModels.Tesoreria;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Tesoreria
{
    public class CobroDao : ConnectionDb
    {
        private GenericResponse _gr;

        public CobroDao()
        {
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idComprobanteIngreso, int idTipoDocumento, int idComprobante)
        {
            var cobros = new List<CobroViewModel>();
            try
            {

                var cmd = new SqlCommand("ASPCobroByDocument", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idComprobanteIngreso", idComprobanteIngreso);
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
                        var item = new CobroViewModel()
                        {
                            cobro = new Cobro
                            {
                                idCobro = reader.GetInt64(3),
                                valor = reader.GetDecimal(4),
                                fechaEmision = reader.GetString(5),
                                abono = reader.GetDecimal(6),

                            },
                            subEntiadaFinanciera = reader.GetString(7),
                            posfechado = reader.GetString(8),
                            cobroEstado = reader.GetString(9),
                            nroTransaccion = reader.GetString(10),
                            banco = reader.GetString(11),
                            cuentaBancaria = reader.GetString(12),
                            tipoDocumento = reader.GetString(13),
                            comprobante = reader.GetString(14),
                        };
                        cobros.Add(item);
                    }
                }
                _gr.data = cobros;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetBy Document";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> GetByComprobanteAsync(int idRol, int idComprobanteIngreso)
        {
            var cobros = new List<CobroViewModel>();
            try
            {

                var cmd = new SqlCommand("ASPCobroByComprobante", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idComprobanteIngreso", idComprobanteIngreso);
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
                        var item = new CobroViewModel()
                        {
                            cobro = new Cobro
                            {
                                idCobro = reader.GetInt64(3),
                                valor = reader.GetDecimal(4),
                                fechaEmision = reader.GetString(5),
                            },
                            subEntiadaFinanciera = reader.GetString(6),
                            posfechado = reader.GetString(7),
                            cobroEstado = reader.GetString(8),
                            nroTransaccion = reader.GetString(9),
                            banco = reader.GetString(10),
                            cuentaBancaria = reader.GetString(11),
                            tipoDocumento = reader.GetString(12),
                            comprobante = reader.GetString(13),
                        };
                        cobros.Add(item);
                    }
                }
                _gr.data = cobros;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetBy Comprobante de Ingreso";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idCobro, string observacion, bool cobro, bool anular)
        {
            try
            {
                var cmd = new SqlCommand("ASPCobroUpdate", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idCobro", idCobro);
                cmd.Parameters.AddWithValue("observacion", observacion);
                cmd.Parameters.AddWithValue("cobro", cobro);
                cmd.Parameters.AddWithValue("anular", anular);
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
                _gr.titleSms = "Actulizar Cobro";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
