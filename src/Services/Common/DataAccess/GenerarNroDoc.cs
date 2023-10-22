using System.Data;
using System.Data.SqlClient;
using Lib.Common;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class GenerarNroDoc
    {

        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public GenerarNroDoc(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> GenerarNroDcAsync(string puntoEmision, int idPuntoEmision, int nroDocumento, string codigoDocumento)
        {

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPGenerarNroDc", con);
                    cmd.Parameters.AddWithValue("puntoEmision", DataValidation.ToDBNullOrDefault(puntoEmision));
                    cmd.Parameters.AddWithValue("idPuntoEmision", idPuntoEmision);
                    cmd.Parameters.AddWithValue("nroDocumento", nroDocumento);
                    cmd.Parameters.AddWithValue("codigoDocumento", codigoDocumento);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
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
        public async Task<GenericResponse> GenerarNroDvAsync(string puntoEmision, int idPuntoEmision, int nroDocumento, string codigoDocumento)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPGenerarNroDv", con);
                    cmd.Parameters.AddWithValue("puntoEmision", DataValidation.ToDBNullOrDefault(puntoEmision));
                    cmd.Parameters.AddWithValue("idPuntoEmision", idPuntoEmision);
                    cmd.Parameters.AddWithValue("nroDocumento", nroDocumento);
                    cmd.Parameters.AddWithValue("codigoDocumento", codigoDocumento);
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
