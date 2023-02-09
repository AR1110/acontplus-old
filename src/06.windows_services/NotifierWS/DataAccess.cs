using HelpersNS20;
using HelpersNS20.Dtos;
using Logs;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Web.UI.WebControls;

namespace NotifierWS
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
                SqlCommand cmd = new SqlCommand("FactElect.Not_Trib_Serv_Get", con);
                cmd.Parameters.AddWithValue("estado", "NE");
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
        public void Update(long id, string estado, string msgError = null)
        {
            //byte[] byteXml = Encoding.UTF8.GetBytes(xmlSigned ?? "Sin Doc");
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                SqlCommand cmd = new SqlCommand("FactElect.Not_Trib_Serv_Update", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("estado", estado);
                cmd.Parameters.AddWithValue("msgError", msgError);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public bool GetDataComprobanteReport(ref ApiReportParamsDto data, string json)
        {
            DataTable _dt = new DataTable();
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("Reporte.Management_Get_To_Print", con);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd))
                {
                    dataAdapter.Fill(_dt);
                }
            }
            if (_dt.Rows.Count > 0)
            {
                data.reportParams = JsonConvert.SerializeObject(_dt);
                return true;
            }

            return false;
        }

        public bool DataSendEmail(ref DataTable ds, string storedProcedureSendMail, string json)
        {
            using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(storedProcedureSendMail, con);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd))
                {
                    dataAdapter.Fill(ds);
                }
            }
            if (ds.Rows.Count > 0)
            {
                return true;
            }
            return false;
        }

    }
}
