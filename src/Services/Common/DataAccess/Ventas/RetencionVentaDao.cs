using System.Data;
using System.Data.SqlClient;
using Domain.Models.Ventas;
using Domain.ViewModels.Ventas;
using Lib.Common;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.Ventas
{
    public class RetencionVentaDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public RetencionVentaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Retencion_Get", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _gr.id = "1";
                        _gr.data = Converters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Retencion de Venta";
            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idRetencionVenta)
        {
            var retencion = new RetencionVentaViewModel();
            var detalle = new List<RetencionVentaDetalleViewModel>();
            var data = new RetencionVentaData();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Retencion_Get_Id", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idRetencionVenta", idRetencionVenta);
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
                            retencion = new RetencionVentaViewModel
                            {
                                retencion = new RetencionVenta()
                                {
                                    idRetencionVenta = reader.GetInt64(3),
                                    idFactura = reader.GetInt64(4),
                                    idCliente = reader.GetInt32(5),
                                    ptoEmision = reader.GetString(6),
                                    nroDoc = reader.GetInt64(7),
                                    fechaEmision = reader.GetDateTime(8).ToString("yyyy-MM-dd"),
                                    nroAutho = reader.GetString(9),
                                    concepto = reader.GetString(10),
                                    total = reader.GetDecimal(11),
                                },
                                nombreFiscal = reader.GetString(12),
                                nroIdentificacion = reader.GetString(13),
                                nroFactura = reader.GetString(14),
                            };

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new RetencionVentaDetalleViewModel()
                                {
                                    detalle = new RetencionVentaDetalle()
                                    {
                                        idRetencionVentaDetalle = reader.GetInt64(0),
                                        idImpuesto = reader.GetInt32(1),
                                        idRetencion = reader.GetInt32(2),
                                        baseImponible = reader.GetDecimal(3),
                                        porcentajeRetencion = reader.GetDecimal(4),
                                        valorRetenido = reader.GetDecimal(5),
                                    },
                                    tipoImpuesto = reader.GetString(6),
                                    codigoImpuesto = reader.GetString(7),
                                    impuesto = reader.GetString(8),
                                };
                                detalle.Add(item);
                            }

                        }
                    }
                }
                data.retencion = retencion;
                data.detalle = detalle;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Retencione de Venta";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, RetencionVentaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Retencion_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCliente", data.retencion.idCliente);
                    cmd.Parameters.AddWithValue("idFactura", data.retencion.idFactura);
                    cmd.Parameters.AddWithValue("codEstab", data.retencion.codEstab);
                    cmd.Parameters.AddWithValue("ptoEmision", data.retencion.ptoEmision);
                    cmd.Parameters.AddWithValue("nroDoc", data.retencion.nroDoc);
                    cmd.Parameters.AddWithValue("nroAutho", data.retencion.nroAutho);
                    cmd.Parameters.AddWithValue("total", data.retencion.total);
                    cmd.Parameters.AddWithValue("fechaEmision", data.retencion.fechaEmision);
                    cmd.Parameters.AddWithValue("concepto", DataValidation.ToDBNullOrDefault(data.retencion.concepto));
                    var p = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("json", p));
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
                _gr.titleSms = "Registrar Retencion de Venta";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idRetencionVenta, RetencionVentaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Retencion_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idRetencionVenta", idRetencionVenta);
                    cmd.Parameters.AddWithValue("idCliente", data.retencion.idCliente);
                    cmd.Parameters.AddWithValue("idFactura", data.retencion.idFactura);
                    cmd.Parameters.AddWithValue("ptoEmision", data.retencion.ptoEmision);
                    cmd.Parameters.AddWithValue("nroDoc", data.retencion.nroDoc);
                    cmd.Parameters.AddWithValue("nroAutho", data.retencion.nroAutho);
                    cmd.Parameters.AddWithValue("total", data.retencion.total);
                    cmd.Parameters.AddWithValue("fechaEmision", data.retencion.fechaEmision);
                    cmd.Parameters.AddWithValue("concepto", DataValidation.ToDBNullOrDefault(data.retencion.concepto));
                    var p = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("json", p));
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
                _gr.titleSms = "Actualizar Retencion de Venta";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idRetencionVenta)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Retencion_Delete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idRetencionVenta", idRetencionVenta);
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
                _gr.titleSms = "Eliminar Retencion de Venta";
            }
            finally
            {

            }
            return _gr;
        }
    }
}
