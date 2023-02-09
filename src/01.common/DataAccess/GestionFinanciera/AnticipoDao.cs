using Helpers;
using Domain.Models;
using Domain.Models.GestionFinanciera;
using Domain.ViewModels.GestionFinanciera;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.GestionFinanciera
{
    public class AnticipoDao : ConnectionDb
    {
        private GenericResponse _gr;

        public AnticipoDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsycn(int idRol, string json)
        {
            DataTable dt = new DataTable ();
            try
            {
                var cmd = new SqlCommand("aspAnticipoGet", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", json);
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
                _gr.titleSms = "Listar Anticipo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, Anticipo data)
        {
            try
            {
                var cmd = new SqlCommand("ASPAnticipoInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idCliente", data.idCliente);
                cmd.Parameters.AddWithValue("codEstab", data.codEstab);
                cmd.Parameters.AddWithValue("idSubEntidadFinanciera", data.idSubEntidadFinanciera);
                cmd.Parameters.AddWithValue("valor", data.valor);
                cmd.Parameters.AddWithValue("observaciones", DataHelper.ToDBNullOrDefault(data.observaciones));
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
                _gr.titleSms = "Registrar Anticipo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }

    }
}
