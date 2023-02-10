using System.Data;
using System.Data.SqlClient;
using Helpers;
using Microsoft.Extensions.Configuration;

namespace DataAccess.GestionTributaria
{
    public class AtsDao
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public AtsDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
        }
        public bool Get(int idRol, string json, ref DataSet ds, ref GenericResponse _response)
        {
            bool successful = true;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPAtsGetData", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(ds);
                    if (ds.Tables[0].Columns.Contains("idError"))
                    {
                        _response.id = ds.Tables[0].Rows[0]["idError"].ToString();
                        _response.message = ds.Tables[0].Rows[0]["msgError"].ToString();
                        successful = false;
                    }
                    dataAdapter.Dispose();
                }
            }
            catch (System.Exception ex)
            {
                successful = false;
                _response.Create("0", ex.Message);
            }
            finally
            {

            }
            return successful;
        }
    }
}
