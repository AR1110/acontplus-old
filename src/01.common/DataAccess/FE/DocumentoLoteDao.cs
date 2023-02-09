using Helpers;
using Domain.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.FE
{
    public class DocumentoLoteDao : ConnectionDb
    {
        private GenericResponse _response = new GenericResponse();
        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
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
                    _response.data = DataHelper.DataTableToJSON(dt);
                }
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, string codDoc)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand cmd = new SqlCommand("ASPDocumentoLoteInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("codDoc", codDoc);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                adapter.Fill(ds);
                _response = DbResponse.SPDataTable(ds.Tables[0]);
                if (_response.id == "1")
                {
                    _response.data = DataHelper.DataTableToJSON(ds.Tables[1]);
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                _response.Create("0", "Error al realizar la generación de lotes");
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
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
        public bool AuthorizeAsync(int idRol, int idDocumentoLote, ref DataSet ds)
        {
            bool _response = false;
            try
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
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idDocumentoLote)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlCommand cmd = new SqlCommand("ASPDocumentoLoteDelete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idDocumentoLote", idDocumentoLote);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                dataAdapter.Fill(dt);
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
    }
}
