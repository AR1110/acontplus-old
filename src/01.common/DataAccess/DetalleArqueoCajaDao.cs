using Domain.Models;
using Domain.ViewModels;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess
{
    public class DetalleArqueoCajaDao : ConnectionDb
    {
        protected GenericResponse _gr;

        public DetalleArqueoCajaDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> ListDetalleArqueoCajaAsync(int idRol)
        {
            var listar = new List<DetalleArqueoCajaViewModel>();
            try
            {
                using (SqlCommand cmd = new SqlCommand("ASPDetalleArqueoCajaList", con))
                {
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _gr.id = reader.GetString(0);
                            _gr.typeNotify = reader.GetString(1);
                            _gr.message = reader.GetString(2);
                            _gr.titleSms = reader.GetString(3);
                            if (_gr.id == "1")
                            {
                                var item = new DetalleArqueoCajaViewModel();
                                item.detalleArqueoCaja = new DetalleArqueoCaja()
                                {
                                    idMoneda = reader.GetInt32(4),
                                    cantidad = reader.GetInt32(5)
                                };
                                item.descripcionMoneda = reader.GetString(6);
                                item.valorMoneda = reader.GetDecimal(7);
                                listar.Add(item);

                            }

                        }
                    }
                    con.Close();
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Detalle Arqueo de Caja";
            }
            return _gr;
        }
    }
}
