using System.Data;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository.GestionFinanciera
{
    public class PagoDao
    {
        private ApiResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public PagoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();
        }

        public async Task<ApiResponse> GetByDocumentAsync(int idRol, int idComprobanteEgreso, int idTipoDocumento, int idComprobante)
        {
            var dt = new DataTable();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspPagoByDocument", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idComprobanteEgreso", idComprobanteEgreso);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    var dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _gr.id = "1";
                        _gr.data = DataConverters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "GetBy Comprobante de Egreso";
            }
            finally
            {

            }
            return _gr;
        }

        public async Task<ApiResponse> UpdateAsync(int idRol, int idPago, string observacion, bool pago, bool anular)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPPagoUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idPago", idPago);
                    cmd.Parameters.AddWithValue("observacion", observacion);
                    cmd.Parameters.AddWithValue("pago", pago);
                    cmd.Parameters.AddWithValue("anular", anular);
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
                _gr.titleSms = "Actulizar Pago";
            }
            finally
            {

            }
            return _gr;
        }
    }
}

