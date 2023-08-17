
using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Inventario
{
    public class ControlStockDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ControlStockDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _response = new GenericResponse();
        }


        public async Task<GenericResponse> GetAsync(int idRol, int idArticulo, decimal cantidad, string presentacion, int idPresentacion)
        {

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPControlStockGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idArticulo", idArticulo);
                    cmd.Parameters.AddWithValue("cantidad", cantidad);
                    cmd.Parameters.AddWithValue("presentacion", presentacion);
                    cmd.Parameters.AddWithValue("idPresentacion", idPresentacion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                        _response.gestion = reader.GetDecimal(3);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Cntrol Stock";
            }
            finally
            {

            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int id)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Inventario.Articulo_Update_Stock");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("id", SqlDbType.Int, id);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
    }
}
