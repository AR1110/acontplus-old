using HelpersNS20;
using HelpersNS20.Dtos;
using Logs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace PrinterWS
{
    public class DataPrint
    {
        private readonly string _conn;
        private readonly string _keyEncrypt;
        public DataPrint()
        {
            _keyEncrypt = ConfigurationManager.AppSettings["keyEncrypt"].ToString();
#if DEBUG
            _conn = ConfigurationManager.AppSettings["ConnectionStringsDev"].ToString();
#else
            _conn = ConfigurationManager.AppSettings["ConnectionStringsPrd"].ToString();
#endif
        }
        public bool Get(string ruc, string estab,string idUser, ref ApiPrintRequestDto _response)
        {            
            DataTable dt = new DataTable();            
            try
            {
                using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("ApiPrinter.Service_Print_Get", con);
                    cmd.Parameters.AddWithValue("ruc", ruc);
                    cmd.Parameters.AddWithValue("estab", estab);
                    cmd.Parameters.AddWithValue("idUser", idUser);
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd))
                    {
                        dataAdapter.Fill(dt);
                    }
                }
                if (dt.Rows.Count > 0)
                {
                    Dictionary<string, object> columns = new Dictionary<string, object>();
                    foreach (DataRow dr in dt.Rows)
                    {
                        columns = dr.Table.Columns.Cast<DataColumn>().ToDictionary(c => c.ColumnName, c => dr[c]);
                    }

                    foreach (var item in columns)
                    {
                        if (item.Key == "token")
                        {
                            _response.token = new Guid(item.Value.ToString());
                        }
                        if (item.Key == "rdlcProps")
                        {
                            var arrayProps = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());
                            Dictionary<string, string> dProps = new Dictionary<string, string>();

                            foreach (var property in arrayProps.FirstOrDefault())
                            {
                                dProps.Add(property.Key, property.Value);
                            }
                            _response.rdlcProps = dProps;
                        }

                        if (item.Key == "rdlcParams" && !string.IsNullOrEmpty(item.Value.ToString()))
                        {
                            var arrayParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());
                            Dictionary<string, string> dParams = new Dictionary<string, string>();
                            foreach (var paramRdlc in arrayParams.FirstOrDefault())
                            {
                                dParams.Add(paramRdlc.Key, paramRdlc.Value);
                            }
                            _response.rdlcParams = dParams;
                        }

                        if (item.Key == "dataSources" && !string.IsNullOrEmpty(item.Value.ToString()))
                        {
                            var arrayDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());
                            Dictionary<string, List<Dictionary<string, string>>> ldDataSources = new Dictionary<string, List<Dictionary<string, string>>>();

                            foreach (var dataSource in arrayDS.FirstOrDefault())
                            {
                                var dataDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(dataSource.Value);
                                List<Dictionary<string, string>> dataSources = new List<Dictionary<string, string>>();
                                
                                foreach(var value in dataDS)
                                {
                                    Dictionary<string, string> itemDs = new Dictionary<string, string>();
                                    foreach (var de in value)
                                    {
                                        itemDs.Add(de.Key, de.Value);
                                    }
                                    dataSources.Add(itemDs);                                    
                                }                                
                                ldDataSources.Add(dataSource.Key, dataSources);
                            }
                            _response.dataSources = ldDataSources;
                        }
                    }
                    Delete(new Guid(dt.Rows[0]["token"].ToString()));
                    return true;
                }               
            }
            catch (Exception ex)
            {
                LogWritter.LogError(ConfigurationManager.AppSettings["dirLogs"].ToString(), "Error al obtener data: " + ex.Message);
            }
            return false;
        }

        public void Delete(Guid token)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(DataEncrypt.DecryptString(_keyEncrypt, _conn)))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("ApiPrinter.Service_Print_Delete", con);
                    cmd.Parameters.AddWithValue("token", token);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                LogWritter.LogError(ConfigurationManager.AppSettings["dirLogs"].ToString(), "Error al eliminar: " + ex.Message);
            }
        }
    }
}
