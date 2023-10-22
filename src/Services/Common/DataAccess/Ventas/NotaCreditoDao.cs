using System.Data;
using System.Data.SqlClient;
using Domain.Models.InfoAdicional;
using Domain.Models.Ventas;
using Domain.ViewModels.Ventas;
using Lib.Common;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.Ventas
{
    public class NotaCreditoDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public NotaCreditoDao(IConfiguration config)
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
                    var cmd = new SqlCommand("Ventas.NotaCredito_Get", con);
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
                _gr.titleSms = "Get Notas de Credito";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idNotaCredito)
        {
            var nota = new NotaCreditoViewModel();
            var detalle = new List<NotaCreditoDetalleViewModel>();
            var infoAdicional = new List<InfoAdicionalDoc>();
            var data = new NotaCreditoData();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.NotaCredito_Get_Id", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idNotaCredito", idNotaCredito);
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
                            nota.nota = new NotaCredito()
                            {
                                idNotaCredito = reader.GetInt64(3),
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
                                total = reader.GetDecimal(22),
                                observacion = reader.GetString(23),
                                idFactura = reader.GetInt64(29),
                            };
                            nota.nombreFiscal = reader.GetString(24);
                            nota.nroIdentificacion = reader.GetString(25);
                            nota.direccion = reader.GetString(26);
                            nota.correo = reader.GetString(27);
                            nota.telefono = reader.GetString(28);
                            nota.nroFactura = reader.GetString(30);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new NotaCreditoDetalleViewModel()
                                {
                                    detalle = new NotaCreditoDetalle()
                                    {
                                        idNotaCreditoDetalle = reader.GetInt64(0),
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
                data.nota = nota;
                data.detalle = detalle;
                data.infoAdicional = infoAdicional;
                _gr.data = data;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Nota de Credito";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, NotaCreditoViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.NotaCredito_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var nota = JsonConvert.SerializeObject(data.nota); cmd.Parameters.Add(new SqlParameter("jsonNotaCredito", nota));
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
                _gr.titleSms = "Registrar Nota de Credito";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, long idNotaCredito, NotaCreditoViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.NotaCredito_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idNotaCredito", idNotaCredito);
                    var nota = JsonConvert.SerializeObject(data.nota); cmd.Parameters.Add(new SqlParameter("jsonNotaCredito", nota));
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
                _gr.titleSms = "Actualizar Nota de Credito";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idNotaCredito)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.NotaCredito_Delete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idNotaCredito", idNotaCredito);
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
                _gr.titleSms = "Eliminar  Nota de Credito";
            }
            finally
            {

            }
            return _gr;
        }
    }
}
