using Common.Core.Interfaces;
using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace Services.Common.CustomFilters
{
    public class StockFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var _transaccion = (ITransaccionService)context.HttpContext.RequestServices.GetService(typeof(ITransaccionService));
            if (context.Result.GetType().Equals(typeof(OkObjectResult)))
            {
                var result = (OkObjectResult)context.Result;
                var response = (APIResponse)result.Value;
                if (response != null && response.code == "1")
                {
                    Dictionary<string, object> payload = JsonConvert.DeserializeObject<Dictionary<string, object>>(response.payload);
                    _transaccion.Process(new Dictionary<string, object> {
                    { "codTran", payload.FirstOrDefault(x => x.Key == "codTran").Value },
                    { "codDoc",  payload.FirstOrDefault(x => x.Key == "codDoc").Value },
                    { "documentoId",  payload.FirstOrDefault(x => x.Key == "documentoId").Value },
                    { "tipo",  payload.FirstOrDefault(x => x.Key == "tipo").Value }
                });
                }
            }
            base.OnActionExecuted(context);
        }
    }
}
