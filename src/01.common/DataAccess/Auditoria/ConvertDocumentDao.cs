using Helpers;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Auditoria
{
    public class ConvertDocumentDao : ConnectionDb
    {
        private GenericResponse _gr;

        public ConvertDocumentDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idTipoDocumento, int idDocumento)
        {

            DataTable dt = new DataTable ();
            try
            {
                var cmd = new SqlCommand("aspConvertDocumentGetId", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                cmd.Parameters.AddWithValue("idDocumento", idDocumento);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter (cmd);
                dataAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    _gr.id = "1";
                    _gr.data = DataHelper.DataTableToJSON(dt);
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Historial Documentos";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
