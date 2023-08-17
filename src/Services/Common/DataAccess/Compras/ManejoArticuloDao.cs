using System.Data;
using System.Data.SqlClient;
using Domain.Models.Compras;
using Domain.ViewModels.Compras;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Compras
{
    public class ManejoArticuloDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ManejoArticuloDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByDocumentPayAsycn(int idRol, int idArticulo, int idTipoDocumento, int idComprobante)
        {
            var info = new List<ManejoArticuloViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPManejoArticuloByDocument", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", idArticulo);
                    cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                    cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new ManejoArticuloViewModel()
                            {
                                manejoArticulo = new ManejoArticulo()
                                {
                                    idManejoArticulo = reader.GetInt32(3),
                                    gestion = reader.GetBoolean(4),
                                },
                                descripcion = reader.GetString(5),
                                json = reader.GetString(6).Replace(@"\", " ").Trim(),
                            };
                            info.Add(item);
                        }
                    }
                }
                _gr.data = info;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {

            }
            return _gr;
        }

    }
}
