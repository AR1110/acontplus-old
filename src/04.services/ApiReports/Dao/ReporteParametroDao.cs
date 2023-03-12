
using HelpersNS20.Dtos;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace ApiReports.Dao
{
    public class ReporteParametroDao : ConnectionDb
    {
        public GenericResponseDto _response = new GenericResponseDto();
        public bool GetByCodeAsync(ApiReportParamsDto parameters, ref DataSet ds)
        {
            bool response = true;
            try
            {
                SqlCommand cmd = new SqlCommand("ASPReporteParametroGetByCode", con);
                cmd.Parameters.AddWithValue("idRol", parameters.idRol);
                cmd.Parameters.AddWithValue("json", parameters.reportParams);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                dataAdapter.Fill(ds);
            }
            catch (Exception ex)
            {
                _ = ex;
                response = false;
            }
            finally
            {
                con.Close();
            }
            return response;
        }
        //OBTENEMOS LA INFORMACION PARA LLENAR EL REPORTE
        public DataSet GetDataToReport(int idRol, string storedProcedure, string jsonData)
        {
            DataSet ds = new DataSet();
            try
            {
                var cmd = new SqlCommand(storedProcedure, con); //PROCEDIMIENTO DE REPORTE DINAMICO
               // cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", jsonData); //PARAMETROS DINAMICOS parameters: {}
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = 0;
                con.Open();
                var dataAdapter = new SqlDataAdapter();
                dataAdapter.SelectCommand = cmd;
                dataAdapter.Fill(ds);
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }
            return ds;
        }
    }
}