using HelpersNS20;
using Logs;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace SignerWS
{
    public class DataAccess
    {
        private readonly string _conn;
        private readonly string _keyEncrypt;
        public DataAccess()
        {
            _keyEncrypt = ConfigurationManager.AppSettings["keyEncrypt"].ToString();
#if DEBUG
            _conn = ConfigurationManager.AppSettings["ConnectionStringsDev"].ToString();
#else
            _conn = ConfigurationManager.AppSettings["ConnectionStringsPrd"].ToString();
#endif
        }
        public bool Get(ref DataTable dt, int cantDocs)
        {
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("FactElect.Doc_Elect_Serv_Get", con);
                cmd.Parameters.AddWithValue("codEstado", 1);
                cmd.Parameters.AddWithValue("cantDocs", cantDocs);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd))
                {
                    dataAdapter.Fill(dt);
                }
            }
            if (dt.Rows.Count > 0)
            {
                return true;
            }
            return false;
        }
        public bool GetInfoDoc(ref DataSet ds, long id)
        {
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("FactElect.Doc_Elect_Serv_Get_Id", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd))
                {
                    dataAdapter.Fill(ds);
                }
            }
            if (ds.Tables.Count > 0)
            {
                return true;
            }
            return false;
        }
        public void Update(long id, string xmlSigned, int codEstado)
        {
            //byte[] byteXml = Encoding.UTF8.GetBytes(xmlSigned ?? "Sin Doc");
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                SqlCommand cmd = new SqlCommand("FactElect.Doc_Elect_Serv_Signer_Update", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("codEstado", codEstado);
                cmd.Parameters.AddWithValue("xmlAcontPlus", DataHelperNS.ToDBNullOrDefault(xmlSigned));
                cmd.Parameters.AddWithValue("msgError", "");
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                cmd.ExecuteNonQuery();
            }

        }
        public void UpdateError(long id, int codEstado, string msgError)
        {
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                SqlCommand cmd = new SqlCommand("FactElect.Doc_Elect_Serv_Signer_Update", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("codEstado", codEstado);
                cmd.Parameters.AddWithValue("xmlAcontPlus", "");
                cmd.Parameters.AddWithValue("msgError", msgError);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}
