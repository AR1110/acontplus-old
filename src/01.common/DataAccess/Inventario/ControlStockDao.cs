
using Helpers;
using Domain.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Inventario
{
    public class ControlStockDao : ConnectionDb
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        public ControlStockDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }


        public async Task<GenericResponse> GetAsync(int idRol, int idArticulo, decimal cantidad, string presentacion, int idPresentacion)
        {

            try
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
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Cntrol Stock";
            }
            finally
            {
                con.Close();
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
