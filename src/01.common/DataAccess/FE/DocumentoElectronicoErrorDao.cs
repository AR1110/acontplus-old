using Helpers;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
    public class DocumentoElectronicoErrorDao : ConnectionDb
    {

        public bool GetByClaveAcceso(string claveAcceso, ref string jsonResponse)
        {
            bool exists = false;
            DataTable dt = new DataTable();
            try
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
            catch (Exception ex)
            {
                exists = false;
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }
            return exists;
        }
    }
}
