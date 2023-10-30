using System.Data;
using System.Text;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.FE
{
    public class DocumentoLoteDao
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public DocumentoLoteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
        }
        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoLoteGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _response.id = "1";
                        _response.data = DataConverters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, string codDoc)
        {
            DataSet ds = new DataSet();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoLoteInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("codDoc", codDoc);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(ds);
                    _response = DataTableMapper.BindData<GenericResponse>(ds.Tables[0]);
                    if (_response.id == "1")
                    {
                        _response.data = DataConverters.DataTableToJSON(ds.Tables[1]);
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                _response.Create("0", "Error al realizar la generación de lotes");
            }
            finally
            {

            }
            return _response;
        }
        public void UpdateAsync(string claveAcceso, string numeroComprobantesLote, int totalAuth, string xmlLote)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
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
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {

            }
        }
        public bool AuthorizeAsync(int idRol, int idDocumentoLote, ref DataSet ds)
        {
            bool _response = false;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoLoteAuthorize", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idDocumentoLote", idDocumentoLote);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(ds);
                    if (ds.Tables.Count > 0)
                    {
                        _response = true;
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idDocumentoLote)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoLoteDelete", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idDocumentoLote", idDocumentoLote);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    _response = null;
                }
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            finally
            {

            }
            return _response;
        }
    }
}
