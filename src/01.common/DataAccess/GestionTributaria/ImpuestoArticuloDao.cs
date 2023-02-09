using Domain.Models;
using Domain.Models.GestionTributaria;
using Domain.ViewModels.GestionTributaria;
using Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.GestionTributaria
{
    public class ImpuestoArticuloDao : ConnectionDb
    {
        protected GenericResponse _gr;
        public ImpuestoArticuloDao()
        {
            _gr= new GenericResponse();
        }

        public async Task<GenericResponse> InsertAsync(int idRol, ImpuestoArticulo data)
        {
            try
            {
                var cmd = new SqlCommand("ASPImpuestoArticuloInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idArticulo", data.idArticulo);
                cmd.Parameters.AddWithValue("idSubContribuyente", data.idSubContribuyente);
                cmd.Parameters.AddWithValue("idRetencionRenta", data.idRetencionRenta);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
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
                _gr.titleSms = "Registrar Impuesto de Articulo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> GetIdAsync(int idRol, int idArticulo)
        {
            var listar = new List<ImpuestoArticuloViewModel>();
            try
            {
                var cmd = new SqlCommand("ASPImpuestoArticuloGetId", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idArticulo", idArticulo);
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
                        var ia = new ImpuestoArticuloViewModel()
                        {
                            impuestoArticulo = new ImpuestoArticulo()
                            {
                                idImpuestoArticulo = reader.GetInt32(3),
                                idSubContribuyente = reader.GetInt32(4),
                                idRetencionRenta = reader.GetInt32(5)
                            },
                            subContribuyente = reader.GetString(6),
                            nombreRetencionRenta = reader.GetString(7),
                            idTipoImpuestoRenta = reader.GetInt32(8),
                            nombreTipoRenta = reader.GetString(9),
                            idTipoContribuyente = reader.GetInt32(10),
                            nombreTipoContribuyente = reader.GetString(11),

                        };
                        listar.Add(ia);
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Impuesto de Articulo";
            }
            finally
            {

                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int idImpuestoArticulo, ImpuestoArticulo data)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("ASPImpuestoArticuloUpdate", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idImpuestoArticulo", idImpuestoArticulo);
                cmd.Parameters.AddWithValue("idArticulo", data.idArticulo);
                cmd.Parameters.AddWithValue("idSubContribuyente", data.idSubContribuyente);
                cmd.Parameters.AddWithValue("idRetencionRenta", data.idRetencionRenta);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
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
                _gr.titleSms = "Actualizar Impuesto de Articulo";
            }
            finally
            {

                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idImpuestoArticulo)
        {
            try
            {
                var cmd = new SqlCommand("ASPImpuestoArticuloDelete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idImpuestoArticulo", idImpuestoArticulo);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
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
                _gr.titleSms = "Eliminar Impuesto de Articulo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }

        //Guardar Lista de Articulos Impuestos 
        public async Task<GenericResponse> ListaInsertAsync(int idRol, List<ImpuestoArticulo> data)
        {
            try
            {
                var cmd = new SqlCommand("ASPImpuestoArticuloListaInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);            
                var lista = JsonConvert.SerializeObject(data);
                cmd.Parameters.Add(new SqlParameter("json", lista));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    _gr.message = reader.GetString(1);
                    _gr.titleSms = reader.GetString(2);

                }                
                con.Close();
            }
            catch(Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
                _gr.titleSms = "Error ";
            }
            return _gr;
        }
    }
}
