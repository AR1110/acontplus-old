using HelpersNS20;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace ApiReports.Dao
{
    public class DocumentoElectronicoDao: ConnectionDb
    {
        public void UpdateAsync(string numeroAutorizacion, string fechaAutorizacion, string comprobante, string estado, bool fromLote)
        {
            try
            {
                byte[] byteXml = Encoding.UTF8.GetBytes(comprobante ?? "Sin Doc");
                SqlCommand cmd = new SqlCommand("ASPDocumentoElectronicoUpdate", con);
                cmd.Parameters.AddWithValue("numeroAutorizacion", DataHelperNS.ToDBNullOrDefault(numeroAutorizacion));
                cmd.Parameters.AddWithValue("fechaAutorizacionString", DataHelperNS.ToDBNullOrDefault(fechaAutorizacion));
                cmd.Parameters.AddWithValue("docXml", byteXml);
                cmd.Parameters.AddWithValue("xmlAcontPlus", DataHelperNS.ToDBNullOrDefault(comprobante));
                cmd.Parameters.AddWithValue("estado", DataHelperNS.ToDBNullOrDefault(estado));
                cmd.Parameters.AddWithValue("fromLote", fromLote);
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
        public void InsertErrorAsync(string claveAcceso, string estado, string identificador, string message, string informacionAdicional, string tipo, bool lote)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("aspDocumentoElectronicoErrorInsert", con);
                cmd.Parameters.AddWithValue("claveAcceso", claveAcceso);
                cmd.Parameters.AddWithValue("estado", DataHelperNS.ToDBNullOrDefault(estado));
                cmd.Parameters.AddWithValue("identificador", DataHelperNS.ToDBNullOrDefault(identificador));
                cmd.Parameters.AddWithValue("mensaje", DataHelperNS.ToDBNullOrDefault(message));
                cmd.Parameters.AddWithValue("informacionAdicional", DataHelperNS.ToDBNullOrDefault(informacionAdicional));
                cmd.Parameters.AddWithValue("tipo", DataHelperNS.ToDBNullOrDefault(tipo));
                cmd.Parameters.AddWithValue("lote", lote);
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