using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace ApiReports.Dao
{
    public class DocumentoLoteDao : ConnectionDb
    {
        public void UpdateAsync(string claveAcceso, string numeroComprobantesLote, int totalAuth, string xmlLote)
        {
            try
            {
                byte[] byteXml = Encoding.UTF8.GetBytes(xmlLote ?? "");
                SqlCommand cmd = new SqlCommand("ASPDocumentoLoteUpdate", con);
                cmd.Parameters.AddWithValue("claveAcceso", claveAcceso);
                cmd.Parameters.AddWithValue("numeroComprobantesLote", Convert.ToInt32(numeroComprobantesLote));
                cmd.Parameters.AddWithValue("totalAuth", totalAuth);
                cmd.Parameters.AddWithValue("xmlLote", byteXml);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }
        }
    }
}