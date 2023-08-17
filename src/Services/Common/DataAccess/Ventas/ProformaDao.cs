using System.Data;
using System.Data.SqlClient;
using Domain.ViewModels.Ventas;
using Lib.Common;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess.Ventas
{
    public class ProformaDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ProformaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }



        public async Task<GenericResponse> InsertAsync(int idRol, ProformaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Proforma_Insert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    var proforma = JsonConvert.SerializeObject(data.proforma); cmd.Parameters.Add(new SqlParameter("jsonProforma", proforma));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
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
                            _gr.lastId = reader.GetInt64(3);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Proforma";

            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idProforma, ProformaViewModel data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.Proforma_Update", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idProforma", idProforma);
                    var proforma = JsonConvert.SerializeObject(data.proforma); cmd.Parameters.Add(new SqlParameter("jsonProforma", proforma));
                    var detalle = JsonConvert.SerializeObject(data.detalle); cmd.Parameters.Add(new SqlParameter("jsonDetalle", detalle));
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Proforma";
            }
            finally
            {

            }
            return _gr;
        }

    }
}
