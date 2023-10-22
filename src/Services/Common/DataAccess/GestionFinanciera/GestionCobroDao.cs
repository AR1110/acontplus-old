using System.Data;
using System.Data.SqlClient;
using Domain.Models.Generic;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;

namespace DataAccess.GestionFinanciera
{
    public class GestionCobroDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public GestionCobroDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByPaymentDocument(int idRol, int idTipoDocumento, int idComprobante)
        {
            var document = new Documento();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPDocumentoPayment", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        document = new Documento()
                        {
                            total = reader.GetDecimal(0),
                            abono = reader.GetDecimal(1),
                            posfechado = reader.GetDecimal(2),
                            saldo = reader.GetDecimal(3),

                        };
                    }
                }
                _gr.data = document;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {

            }
            return _gr;
        }
    }
}
