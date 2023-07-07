using Domain.Models.Compras;
using Domain.ViewModels.Compras;
using Helpers;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.Compras
{
    public class OrdenCompraDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public OrdenCompraDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Orden_Get", con);
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
                _gr.titleSms = "Listar Orden de Compra";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idOrdenCompra)
        {

            var ordenCompra = new OrdenCompraViewModel();
            var detalle = new List<OrdenCompraDetalleViewModel>();
            var data = new OrdenCompraData();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Orden_GetId", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idOrdenCompra", idOrdenCompra);
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
                            ordenCompra.ordenCompra = new OrdenCompra()
                            {
                                idOrdenCompra = reader.GetInt64(3),
                                idProveedor = reader.GetInt32(4),
                                idPuntoEmision = reader.GetInt32(5),
                                nroDocumento = reader.GetInt64(6),
                                fechaEmision = reader.GetDateTime(7).ToString("yyyy-MM-dd"),
                                subTotalSinImpuestos = reader.GetDecimal(8),
                                subTotalIva = reader.GetDecimal(9),
                                subTotalNetoIva = reader.GetDecimal(10),
                                subTotalIvaCero = reader.GetDecimal(11),
                                subTotalNetoIvaCero = reader.GetDecimal(12),
                                subTotalNoObjetoIva = reader.GetDecimal(13),
                                subTotalNetoNoObjetoIva = reader.GetDecimal(14),
                                subTotalExentoIva = reader.GetDecimal(15),
                                subTotalNetoExentoIva = reader.GetDecimal(16),
                                totalDescuento = reader.GetDecimal(17),
                                porcentajeDescuento = reader.GetDecimal(18),
                                totalIce = reader.GetDecimal(19),
                                irbpnr = reader.GetDecimal(20),
                                propina = reader.GetDecimal(21),
                                iva = reader.GetDecimal(22),
                                recargo = reader.GetDecimal(23),
                                transporte = reader.GetDecimal(24),
                                total = reader.GetDecimal(25),
                                observacion = reader.GetString(26),
                            };
                            ordenCompra.nombreFiscal = reader.GetString(27);
                            ordenCompra.nroIdentificacion = reader.GetString(28);
                            ordenCompra.correo = reader.GetString(29);
                            ordenCompra.direccion = reader.GetString(30);

                            reader.NextResult();
                            while (reader.Read())
                            {
                                var item = new OrdenCompraDetalleViewModel
                                {
                                    detalle = new OrdenCompraDetalle()
                                    {
                                        idOrdenCompraDetalle = reader.GetInt64(0),
                                        idBodega = reader.GetInt32(1),
                                        idArticulo = reader.GetInt32(2),
                                        idMedida = reader.GetInt32(3),
                                        descripcion = reader.GetString(4),
                                        cantidad = reader.GetDecimal(5),
                                        precioCosto = reader.GetDecimal(6),
                                        precioCostoNeto = reader.GetDecimal(7),
                                        porcentajeDescuento = reader.GetDecimal(8),
                                        valorDescuento = reader.GetDecimal(9),
                                        nota = reader.GetString(10),
                                        idTipoIva = reader.GetInt32(17),
                                    },
                                    codigo = reader.GetString(11),
                                    llevaInventario = reader.GetBoolean(12),
                                    nombreMedida = reader.GetString(13),
                                    nombreTipoIva = reader.GetString(14),
                                    codigoTipoIva = reader.GetString(15),
                                    ice = reader.GetDecimal(16)
                                };
                                detalle.Add(item);
                            }
                        }
                    }
                }
                data.ordenCompra = ordenCompra;
                data.detalle = detalle;
                _gr.data = data;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetId Orden de Compra";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, OrdenCompraViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Orden_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var ordenCompra = JsonConvert.SerializeObject(data.ordenCompra); cmd.Parameters.Add(new SqlParameter("jsonOrdenCompra", ordenCompra));
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
                _gr.titleSms = "Registrar Orden de Compra";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idOrdenCompra, OrdenCompraViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Orden_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idOrdenCompra", idOrdenCompra);
                    var ordenCompra = JsonConvert.SerializeObject(data.ordenCompra); cmd.Parameters.Add(new SqlParameter("jsonOrdenCompra", ordenCompra));
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
                _gr.titleSms = "Actualizar Orden de Compra";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idOrdenCompra)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Compra.Orden_Delete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idOrdenCompra", idOrdenCompra);
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
                _gr.titleSms = "Eliminar Orden de Compra";
            }
            finally
            {

            }
            return _gr;
        }

    }
}
