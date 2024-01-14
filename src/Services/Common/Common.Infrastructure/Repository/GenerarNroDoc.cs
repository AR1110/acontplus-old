using System.Data;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class GenerarNroDoc
    {

        private readonly IConfiguration _config;
        protected ApiResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public GenerarNroDoc(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();

        }
        public async Task<ApiResponse> GenerarNroDcAsync(string puntoEmision, int idPuntoEmision, int nroDocumento, string codigoDocumento)
        {

            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPGenerarNroDc", con);
                    cmd.Parameters.AddWithValue("puntoEmision", puntoEmision.ToDBNullOrDefault());
                    cmd.Parameters.AddWithValue("idPuntoEmision", idPuntoEmision);
                    cmd.Parameters.AddWithValue("nroDocumento", nroDocumento);
                    cmd.Parameters.AddWithValue("codigoDocumento", codigoDocumento);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.message = reader.GetString(1);
                            _gr.titleSms = reader.GetString(2);
                            if (_gr.id == "1")
                            {

                                _gr.data = reader.GetString(3);
                            }
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Generar Numero Documento Compra";
            }
            return _gr;
        }
        public async Task<ApiResponse> GenerarNroDvAsync(string puntoEmision, int idPuntoEmision, int nroDocumento, string codigoDocumento)
        {
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPGenerarNroDv", con);
                    cmd.Parameters.AddWithValue("puntoEmision", puntoEmision.ToDBNullOrDefault());
                    cmd.Parameters.AddWithValue("idPuntoEmision", idPuntoEmision);
                    cmd.Parameters.AddWithValue("nroDocumento", nroDocumento);
                    cmd.Parameters.AddWithValue("codigoDocumento", codigoDocumento);
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
                            _gr.data = reader.GetString(3);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Nro Documento de Venta";
            }
            return _gr;
        }

    }
}
