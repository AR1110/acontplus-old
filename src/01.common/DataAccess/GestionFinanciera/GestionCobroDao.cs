using Domain.Models;
using Domain.Models.Generic;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.GestionFinanciera
{
    public class GestionCobroDao : ConnectionDb
    {
        private GenericResponse _gr;

        public GestionCobroDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByPaymentDocument(int idRol, int idTipoDocumento, int idComprobante)
        {
            var document = new Documento();
            try
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
                _gr.data = document;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
