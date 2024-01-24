using System.Data;
using Common.Core.Models;
using Common.Core.Models.Tesoreria;
using Common.Core.ViewModels.GestionFinanciera;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository.GestionFinanciera
{
    public class CobroDetalleDao
    {
        private ApiResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public CobroDetalleDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();
        }

        public async Task<ApiResponse> GetByDocumentAsync(int idRol, int idCobro, int idTipoDocumento, int idComprobante)
        {
            var detalle = new List<CobroDetalleViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCobroDetalleByDocument", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCobro", idCobro);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
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

        public async Task<ApiResponse> GetByCobroAsync(int idRol, int idCobro)
        {
            var detalle = new List<CobroDetalleViewModel>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPCobroDetalleByCobro", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCobro", idCobro);
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
