
using HelpersNS20.Dtos;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace ApiReports.Dao
{
    public class ReporteDao : ConnectionDb
    {
        public GenericResponseDto _resp = new GenericResponseDto();

        public async Task<GenericResponseDto> GetParametersAsync(ApiReportParamsDto parameters)
        {
            var data = new ReporteParametroDto();
            try
            {
                var cmd = new SqlCommand("ASPReporteGetToPrint", con);
                cmd.Parameters.AddWithValue("idRol", parameters.idRol);
                cmd.Parameters.AddWithValue("json", parameters.reportParams);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _resp.id = reader.GetString(0);
                    _resp.message = reader.GetString(1);
                    if (_resp.id == "1")
                    {
                        data.reportPath = reader.GetString(2);
                        data.dataSource = reader.GetString(3);
                        data.storedProcedure = reader.GetString(4);
                        data.format = reader.GetString(5); //desde la vista /pdf/excel/word
                        data.contentType = reader.GetString(6); //para procesar el archivo del reporte
                        data.mimeType = reader.GetString(7); //tipo de imagen de logo
                        data.imagen = (byte[])reader["imagen"];
                        data.fileName = reader.GetString(9);
                    }
                }

                _resp.payload = data;
            }
            catch (Exception ex)
            {
                _resp.id = "0";
                _resp.message = ex.Message;
            }
            finally
            {
                con.Close();
            }
            return _resp;
        }
        //OBTENEMOS LA INFORMACION PARA LLENAR EL REPORTE
        public async Task<DataSet> GetDataAsync(int idRol, ReporteParametroDto data)
        {
            var ds = new DataSet();
            try
            {
                var cmd = new SqlCommand(data.storedProcedure, con); //PROCEDIMIENTO DE REPORTE DINAMICO 
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", data.json); //PARAMETROS DINAMICOS parameters: {}
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                var dataAdapter = new SqlDataAdapter
                {
                    SelectCommand = cmd
                };
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



        public async Task<string> GetClaveAccesoAsync(string json)
        {
            string claveAcceso = "";
            try
            {
                var cmd = new SqlCommand("ASPFacturaGetClaveAcceso", con); //PROCEDIMIENTO DE REPORTE DINAMICO  
                cmd.Parameters.AddWithValue("json", json); //PARAMETROS DINAMICOS parameters: {}
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                claveAcceso = Convert.ToString(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }
           
            return claveAcceso;
        }

        
        public async Task<string> LiquidacionCompraGetClaveAcceso(string json)
        {
            string claveAcceso = "";
            try
            {
                var cmd = new SqlCommand("ASPLiquidacionCompraGetClaveAcceso", con); //PROCEDIMIENTO DE REPORTE DINAMICO  
                cmd.Parameters.AddWithValue("json", json); //PARAMETROS DINAMICOS parameters: {}
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                claveAcceso = Convert.ToString(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }

            return claveAcceso;
        }

        public async Task<string> RetCompraGetClaveAcceso(string json)
        {
            string claveAcceso = "";
            try
            {
                var cmd = new SqlCommand("ASPRetencionCompraGetClaveAcceso", con); 
                cmd.Parameters.AddWithValue("json", json); 
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                claveAcceso = Convert.ToString(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }

            return claveAcceso;
        }


        //Obtener Clave Acceso de Nota Credito Cliente 
        public async Task<string> NotaCreditoClienteGetClaveAcceso(string json)
        {
            string claveAcceso = "";
            try
            {
                var cmd = new SqlCommand("ASPNotaCreditoClienteGetClaveAcceso", con);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                claveAcceso = Convert.ToString(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }

            return claveAcceso;
        }

        
        public async Task<string> GuiaRemisionGetClaveAcceso(string json)
        {
            string claveAcceso = "";
            try
            {
                var cmd = new SqlCommand("ASPGuiaRemisionGetClaveAcceso", con);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                claveAcceso = Convert.ToString(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }

            return claveAcceso;
        }





    }
}