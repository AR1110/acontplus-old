using Helpers;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.FE
{
    public class DocumentoLoteDetalleDao : ConnectionDb
    {
        private GenericResponse _response = new GenericResponse();
        public async Task<GenericResponse> GetAsync(int idRol, int idDocumentoLote)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlCommand cmd = new SqlCommand("ASPDocumentoDetalleLoteGet", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idDocumentoLote", idDocumentoLote);
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
            return _response;
        }
        public async Task<bool> DeleteAsync(int idRol, long id)
        {
            bool deleted = true;
            try
            {
                SqlCommand cmd = new SqlCommand("ASPDocumentoDetalleLoteDelete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("id", id);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlParameter outPutParameter = new SqlParameter();
                outPutParameter.ParameterName = "@deleted";
                outPutParameter.SqlDbType = System.Data.SqlDbType.Bit;
                outPutParameter.Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters.Add(outPutParameter);
                await con.OpenAsync();
                cmd.ExecuteNonQuery();
                deleted = Convert.ToBoolean(outPutParameter.Value);
            }
            catch (Exception ex)
            {
                deleted = false;
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }
            return deleted;
        }
    }
}
