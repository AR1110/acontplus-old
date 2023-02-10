using Helpers;
using Domain.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.FE
{
    public class DocumentoElectronicoDao
    {
        private GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public DocumentoElectronicoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _response = new GenericResponse();
        }
        public async Task<GenericResponse> GetNotSignedAsync(int idRol)
        {
            DataSet ds = new DataSet();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoElectronicoGetNotSigned", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(ds);
                    if (ds.Tables.Count > 0)
                    {
                        _response.id = "1";
                        _response.data = DataHelper.DataTableToJSON(ds.Tables[0]);
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
        public async Task<GenericResponse> GetNotAuthorizedAsync(int idRol)
        {
            DataSet ds = new DataSet();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoElectronicoGetNotAuthorized", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(ds);
                    if (ds.Tables.Count > 0)
                    {
                        _response.id = "1";
                        _response.data = DataHelper.DataTableToJSON(ds.Tables[0]);
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
        public bool GetAuthorize(int idRol, string codDoc, long idDocumento, bool onlySign, ref DataSet ds)
        {
            bool _response = true;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPDocumentoElectronicoGetAuthorize", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("codDoc", codDoc);
                    cmd.Parameters.AddWithValue("idDocumento", idDocumento);
                    cmd.Parameters.AddWithValue("onlySign", onlySign);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(ds);
                    if (ds.Tables.Count == 0)
                    {
                        _response = false;
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                _response = false;
            }
            finally
            {
                
            }
            return _response;
        }
        //public async Task<bool> UpdateAsync(ResponseFE data)
        //{
        //    bool isSuccess = false;
        //    try
        //    {
        //        byte[] byteXml = Encoding.UTF8.GetBytes(data.xml ?? "No existe xml");
        //        XmlDocument docXml = new XmlDocument();
        //        docXml.LoadXml(data.xml);

        //        XmlNodeList ncodDoc = docXml.GetElementsByTagName("codDoc");
        //        string codDoc = ncodDoc[0].InnerText;

        //        XmlNodeList nClaveAcceso = docXml.GetElementsByTagName("claveAcceso");
        //        string claveAcceso = nClaveAcceso[0].InnerText;

        //        SqlCommand cmd = new SqlCommand("ASPDocumentoElectronicoUpdate", con);
        //        cmd.Parameters.AddWithValue("codDoc", codDoc);
        //        cmd.Parameters.AddWithValue("claveAcceso", claveAcceso);
        //        cmd.Parameters.AddWithValue("codigoAutorizacion", DataHelper.ToDBNullOrDefault(data.codigoAutorizacion));
        //        cmd.Parameters.AddWithValue("fechaAutorizacion", DataHelper.ToDBNullOrDefault(data.fechaAutorizacion));
        //        cmd.Parameters.AddWithValue("docXml", byteXml);
        //        cmd.Parameters.AddWithValue("estado", data.estado);
        //        cmd.Parameters.AddWithValue("identificador", DataHelper.ToDBNullOrDefault(data.identificador));
        //        cmd.Parameters.AddWithValue("message", DataHelper.ToDBNullOrDefault(data.message));
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        await con.OpenAsync();
        //        cmd.ExecuteNonQuery();
        //        isSuccess = true;
        //    }
        //    catch (Exception ex)
        //    {
        //        _ = ex.Message;
        //        isSuccess = false;
        //    }
        //    finally
        //    {
        //        
        //    }
        //    return isSuccess;
        //}
        public void UpdateAsync(string numeroAutorizacion, string fechaAutorizacion, string comprobante, string estado, bool fromLote)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    byte[] byteXml = Encoding.UTF8.GetBytes(comprobante ?? "Sin Doc");
                    SqlCommand cmd = new SqlCommand("ASPDocumentoElectronicoUpdate", con);
                    cmd.Parameters.AddWithValue("numeroAutorizacion", DataHelper.ToDBNullOrDefault(numeroAutorizacion));
                    cmd.Parameters.AddWithValue("fechaAutorizacionString", DataHelper.ToDBNullOrDefault(fechaAutorizacion));
                    cmd.Parameters.AddWithValue("docXml", byteXml);
                    cmd.Parameters.AddWithValue("xmlAcontPlus", DataHelper.ToDBNullOrDefault(comprobante));
                    cmd.Parameters.AddWithValue("estado", DataHelper.ToDBNullOrDefault(estado));
                    cmd.Parameters.AddWithValue("fromLote", fromLote);
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
        public void InsertErrorAsync(string claveAcceso, string estado, string identificador, string message, string informacionAdicional, string tipo, bool lote)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("aspDocumentoElectronicoErrorInsert", con);
                    cmd.Parameters.AddWithValue("claveAcceso", claveAcceso);
                    cmd.Parameters.AddWithValue("estado", DataHelper.ToDBNullOrDefault(estado));
                    cmd.Parameters.AddWithValue("identificador", DataHelper.ToDBNullOrDefault(identificador));
                    cmd.Parameters.AddWithValue("mensaje", DataHelper.ToDBNullOrDefault(message));
                    cmd.Parameters.AddWithValue("informacionAdicional", DataHelper.ToDBNullOrDefault(informacionAdicional));
                    cmd.Parameters.AddWithValue("tipo", DataHelper.ToDBNullOrDefault(tipo));
                    cmd.Parameters.AddWithValue("lote", lote);
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
    }
}
