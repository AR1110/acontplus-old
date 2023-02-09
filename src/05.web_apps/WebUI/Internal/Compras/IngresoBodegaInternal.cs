using DataAccess.Compras;
using Domain.Models;
using Domain.ViewModels.Compras;
using Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Internal.Compras
{
    public class IngresoBodegaInternal
    {
        protected GenericResponse _gr;
        public IngresoBodegaInternal()
        {
            _gr = new GenericResponse();
        }

        IngresoBodegaDao _ib = new();

        internal async Task<GenericResponse> PostIngresoBoega(int tipOperacion, int idRol, int idIngresoBodega, IngresoBodegaViewModel data)
        {

            try
            {
                switch (tipOperacion)
                {
                    //Tipo 0 es para eliminar
                    case 0:
                        var dele = await _ib.DeleteAsync(idRol, idIngresoBodega);
                        _gr.id = dele.id;
                        _gr.message = dele.message;
                        _gr.titleSms = dele.titleSms;

                        break;

                    case 1:
                        var post = await _ib.InsertAsync(idRol, data);
                        _gr.id = post.id;
                        _gr.message = post.message;
                        _gr.titleSms = post.titleSms;
                        break;

                    case 2:
                        var put = await _ib.UpdateAsync(idRol, idIngresoBodega, data);
                        _gr.id = put.id;
                        _gr.message = put.message;
                        _gr.titleSms = put.titleSms;
                        break;
                }

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Post Ingreso Compra";
            }
            return _gr;
        }
    }
}
