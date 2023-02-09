using Domain.Models;
using Domain.Models.GestionTributaria;
using Domain.ViewModels.GestionTributaria;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.GestionTributaria
{
    public class RetencionRentaDao : ConnectionDb
    {


        protected GenericResponse _gr;

        public RetencionRentaDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<RetencionRentaViewModel>();
            try
            {
                var cmd = new SqlCommand("ASPRetencionRentaGet", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                cmd.Parameters.AddWithValue("pageSize", pageSize);
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
                        var _io = new RetencionRentaViewModel
                        {
                            retencionRenta = new RetencionRenta()
                            {
                                idRetencionRenta = reader.GetInt32(3),
                                descripcion = reader.GetString(4),
                                codigoAnexo = reader.GetString(5),
                                porcentaje = reader.GetDecimal(6),
                                campoFormulario103 = reader.GetString(7),
                                estado = reader.GetBoolean(8),
                                idTipoImpuestoRenta = reader.GetInt32(9)
                            },
                            tipoImpuestoRenta = reader.GetString(10),
                            totalRecords = reader.GetInt32(11)
                        };
                        listar.Add(_io);
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Impuesto";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        //Operaciones Especiales
        public async Task<GenericResponse> GetIdAsync(int idTipoImpuestoRenta)
        {
            var listar = new List<RetencionRenta>();
            try
            {
                var cmd = new SqlCommand("ASPRetencionRentaGetId", con);
                cmd.Parameters.AddWithValue("idTipoImpuestoRenta", idTipoImpuestoRenta);
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
                        var i = new RetencionRenta
                        {
                            idRetencionRenta = reader.GetInt32(3),
                            descripcion = reader.GetString(4)
                        };
                        listar.Add(i);
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Select Impuesto";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
