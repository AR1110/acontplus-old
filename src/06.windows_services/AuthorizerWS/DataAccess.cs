using FactElect.Dtos;
using HelpersNS20;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace AuthorizerWS
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
                cmd.Parameters.AddWithValue("codEstado", 3);
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
        public void InsertError(long id, ResponseSriDto data)
        {
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                SqlCommand cmd = new SqlCommand("FactElect.Doc_Elect_Error_Insert", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("estado", DataHelperNS.ToDBNullOrDefault(data.estado));
                cmd.Parameters.AddWithValue("identificador", DataHelperNS.ToDBNullOrDefault(data.identificador));
                cmd.Parameters.AddWithValue("mensaje", DataHelperNS.ToDBNullOrDefault(data.message));
                cmd.Parameters.AddWithValue("informacionAdicional", DataHelperNS.ToDBNullOrDefault(data.informacionAdicional));
                cmd.Parameters.AddWithValue("tipo", DataHelperNS.ToDBNullOrDefault(data.tipo));
                cmd.Parameters.AddWithValue("xmlSri", data.xmlSri);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                cmd.ExecuteNonQuery();
            }

        }
        public void Update(long id, string xmlAutorized, string dateAutorized, int codEstado)
        {
            byte[] byteXml = Encoding.UTF8.GetBytes(xmlAutorized ?? "<Sin Doc />");
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                SqlCommand cmd = new SqlCommand("FactElect.Doc_Elect_Serv_Authorize_Update", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("codEstado", codEstado);
                cmd.Parameters.AddWithValue("xmlSri", byteXml);
                cmd.Parameters.AddWithValue("dateAutorized", DataHelperNS.ToDBNullOrDefault(dateAutorized));
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}
