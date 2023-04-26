using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.GestionFinanciera
{
    public class PagoDetalleDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public PagoDetalleDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idPago, int idTipoDocumento, int idComprobante)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspPagoDetalleByDocument", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idPago", idPago);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
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
                _gr.titleSms = "GetBy Pago";
            }
            finally
            {

            }
            return _gr;
        }
    }
}
