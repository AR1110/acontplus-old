using Helpers;
using Domain.Models;
using Domain.Models.Tesoreria;
using Domain.ViewModels.Tesoreria;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Tesoreria
{
    public class ComprobanteIngresoDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ComprobanteIngresoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idTipoDocumento, int idComprobante)
        {
            var comprobantes = new List<ComprobanteIngresoViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("GestFinanc.ComprobanteIngreso_Get_ByDocument", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
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
                            var item = new ComprobanteIngresoViewModel()
                            {
                                comprobanteIngreso = new ComprobanteIngreso()
                                {
                                    idComprobanteIngreso = reader.GetInt64(3),
                                    total = reader.GetDecimal(4),
                                    fechaRegistro = reader.GetString(5),
                                    abono = reader.GetDecimal(6),
                                    cambio = reader.GetDecimal(7),
                                },
                                nroDocumento = reader.GetString(8),
                                cliente = reader.GetString(9),
                                nroIdentificacion = reader.GetString(10),
                                caja = reader.GetString(11),
                                color = reader.GetString(12),
                                estado = reader.GetString(13),
                            };
                            comprobantes.Add(item);
                        }
                    }
                }
                _gr.data = comprobantes;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get By Document";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> PostFastAsync(int idRol, int idTipoDocumento, int idComprobante, ComprobanteIngresoViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("GestFinanc.ComprobanteIngreso_Insert_Fast", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.Parameters.AddWithValue("idCliente", data.comprobanteIngreso.idCliente);
                    cmd.Parameters.AddWithValue("codEstab", data.comprobanteIngreso.codEstab);
                    cmd.Parameters.AddWithValue("total", data.comprobanteIngreso.total);
                    cmd.Parameters.AddWithValue("abono", data.comprobanteIngreso.abono);
                    var cobros = JsonConvert.SerializeObject(data.cobros); cmd.Parameters.Add(new SqlParameter("jsonCobro", cobros));
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
                _gr.titleSms = "Comprobante de Ingreso - Cobro Rapido";
            }
            finally
            {

            }
            return _gr;
        }

    }
}
