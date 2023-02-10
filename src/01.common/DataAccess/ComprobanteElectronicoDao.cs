using Helpers;
using Domain.Models;
using System;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class ComprobanteElectronicoDao
    {
        public GenericResponse _gr= new GenericResponse();
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ComprobanteElectronicoDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
        }
        public async Task<GenericResponse> UpdateAuthorizedAsync(int idRol, string codDoc, long idComprombante, string fileName, ResponseFE data)
        {
            //string decode = HttpUtility.HtmlDecode(data.xml);
            byte[] docXml = Encoding.UTF8.GetBytes(data.xml);
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPComprobanteAutorizadoInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("codDoc", codDoc);
                    cmd.Parameters.AddWithValue("idComprombante", idComprombante);
                    cmd.Parameters.AddWithValue("fileName", fileName);
                    cmd.Parameters.AddWithValue("docXml", docXml);
                    cmd.Parameters.AddWithValue("codigoAutorizacion", data.codigoAutorizacion);
                    cmd.Parameters.AddWithValue("fechaAuthorizacion", Convert.ToDateTime(data.fechaAutorizacion));
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = data.estado + " " + reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            _gr.data = reader.GetBoolean(3); //SI ES AUTORIZADO
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> PutNotAuthorizedAsync(int idRol, string codDoc, long idComprombante, string fileName, ResponseFE data)
        {
            //string decode = HttpUtility.HtmlDecode(data.xml);
            byte[] docXml = Encoding.UTF8.GetBytes(data.xml);
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPComprobanteNoAutorizadoInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("codDoc", codDoc);
                    cmd.Parameters.AddWithValue("idComprombante", idComprombante);
                    cmd.Parameters.AddWithValue("fileName", fileName);
                    cmd.Parameters.AddWithValue("docXml", docXml);
                    cmd.Parameters.AddWithValue("message", DataHelper.ToDBNullOrDefault(data.message));
                    cmd.Parameters.AddWithValue("codigoAutorizacion", DataHelper.ToDBNullOrDefault(data.codigoAutorizacion));
                    cmd.Parameters.AddWithValue("fechaAuthorizacion", DataHelper.ToDBNullOrDefault(data.fechaAutorizacion));
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = data.estado + " " + reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            _gr.data = reader.GetBoolean(3); //SI ES AUTORIZADO
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }
            finally
            {
                
            }
            return _gr;
        }
    }
}
