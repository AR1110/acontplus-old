using Helpers;
using Domain.Models;
using Domain.Models.GestionFinanciera;
using Domain.ViewModels.GestionFinanciera;
using Domain.ViewModels.Tesoreria;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.GestionFinanciera
{
    public class PagoDao : ConnectionDb
    {
        private GenericResponse _gr;

        public PagoDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByDocumentAsync(int idRol, int idComprobanteEgreso, int idTipoDocumento, int idComprobante)
        {
            DataTable dt = new DataTable ();
            try
            {

                var cmd = new SqlCommand("aspPagoByDocument", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idComprobanteEgreso", idComprobanteEgreso);
                cmd.Parameters.AddWithValue("idTipoDocumento", idTipoDocumento);
                cmd.Parameters.AddWithValue("idComprobante", idComprobante);
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
                _gr.titleSms = "GetBy Comprobante de Egreso";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }

        public async Task<GenericResponse> UpdateAsync(int idRol, int idPago, string observacion, bool pago, bool anular)
        {
            try
            {
                var cmd = new SqlCommand("ASPPagoUpdate", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idPago", idPago);
                cmd.Parameters.AddWithValue("observacion", observacion);
                cmd.Parameters.AddWithValue("pago", pago);
                cmd.Parameters.AddWithValue("anular", anular);
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
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actulizar Pago";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}

