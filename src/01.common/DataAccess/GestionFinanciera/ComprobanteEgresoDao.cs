using Helpers;
using Domain.Models;
using Domain.Models.GestionFinanciera;
using Domain.Models.Tesoreria;
using Domain.ViewModels.GestionFinanciera;
using Domain.ViewModels.Tesoreria;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.GestionFinanciera
{
    public class ComprobanteEgresoDao : ConnectionDb
    {
        private GenericResponse _gr;

        public ComprobanteEgresoDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                var cmd = new SqlCommand("GestFinanc.ComprobanteEgreso_Get", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
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
                _gr.titleSms = "Listar Comprobantes de Egreso";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idTipoDocumento, int idComprobante)
        {
            DataTable dt = new DataTable();
            try
            {
                var cmd = new SqlCommand("GestFinanc.ComprobanteEgreso_Get_ByDocument", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                cmd.Parameters.AddWithValue("idComprobante", idComprobante);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
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
                _gr.titleSms = "Get By Document";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }

    }
}
