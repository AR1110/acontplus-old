using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Xml;
using System.Xml.Serialization;

namespace DataAccess.FE
{
    public class comprobante
    {
        public string claveAcceso { get; set; }
    }
    public class Comprobantes
    {
        [XmlElement(ElementName = "comprobantes", Type = typeof(comprobante))]
        public comprobante[] list;

        public Comprobantes()
        {
            list = new comprobante[0];
        }
    }
    public class DocumentoElectronicoErrorDao
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public DocumentoElectronicoErrorDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
        }
        public bool GetByClaveAcceso(string claveAcceso, ref string jsonResponse)
        {
            bool exists = false;
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoElectronicoErrorGetByCA", con);
                    cmd.Parameters.AddWithValue("claveAcceso", claveAcceso);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        jsonResponse = DataHelper.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                exists = false;
                _ = ex.Message;
            }
            finally
            {

            }
            return exists;
        }
    }
}
