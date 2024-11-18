using Common.Core.Enums;
using Microsoft.Extensions.Configuration;

namespace FactElect.Application.Services;
public interface IDocumentoXmlToHtml
{
    string CreateHtml(ComprobanteElectronico comprobanteElectronico);
}
public class DocumentoXmlToHtml(IConfiguration configuration) : IDocumentoXmlToHtml
{
    public string CreateHtml(ComprobanteElectronico data)
    {
        var dt = (SriDocument)Convert.ToInt32(data.codDoc);
        var documentName = dt.DisplayName();
        var doc = @"
                    <div class=""row"">
                        <div class=""col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6"">
                            <div class=""card border border-dark rounded"">
                                <div class=""card-body"">
<div class=""text-center"">
                                    <img src=" +
                  $"data:image/png;base64,{Convert.ToBase64String(File.ReadAllBytes($"{configuration["Logos:Generic"]}NoLogo.png"))}" +
                  @" alt=""NO LOGO"" class=""img-fluid"" align=""center"" width=""100"">
</div>
                                    <h6>" + data.infoTributaria.razonSocial + @"</h6>
                                    
                                    <h6>" + data.infoTributaria.nombreComercial + @"</h6>
                                    <br>
                                    <h6><label>Dirección Matriz:</label> " + data.infoTributaria.dirMatriz + @"</h6>
                                    <br>
                                    " + GetInfoTrib(data) + @"
                                </div>
                            </div>
                        </div>
                        <div class=""col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6"">
                            <div class=""card border border-dark rounded"">
                                <div class=""card-body"">
                                    <h5><label>RUC: </label> "
                  + data.infoTributaria.ruc + @"</h5>
                                    <h4>" + documentName + @"</h4>
                                    <h5>
                                        <label>No.</label>
                                        " + data.infoTributaria.estab + @"-" + data.infoTributaria.ptoEmi + @"-" +
                  data.infoTributaria.secuencial + @"
                                    </h5>
                                    <label>NÚMERO DE AUTORIZACIÓN</label><br>
                                    <small>
                                        " + data.infoTributaria.claveAcceso + @"
                                    </small>
                                    <label>FECHA Y HORA DE AUTORIZACIÓN</label>
                                    <small>
                                        " + data.fechaAutorizacion + @"
                                    </small>
                                    <h5>
                                        <label>AMBIENTE:</label>
                                         " + (data.infoTributaria.ambiente == "1" ? "PRUEBAS" : "PRODUCCIÓN") + @"
                                    </h5>
                                    <h5>
                                        <label>EMISIÓN:</label>
                                        " + (data.infoTributaria.tipoEmision == "1" ? "NORMAL" : "") + @"
                                    </h5>
                                    <label>CLAVE DE ACCESSO</label><br />
<div class=""text-center"">
                                    <img id=""barcodeImg"" src=" +
                  $"data:image/png;base64,{Convert.ToBase64String(BarcodeGen.Create(new BarcodeConfig { Text = data.infoTributaria.claveAcceso }), 0, BarcodeGen.Create(new BarcodeConfig { Text = data.infoTributaria.claveAcceso }).Length)}" +
                  @" alt="""" align=""center"" class=""img-fluid"" height=""60"" width=""500"">
                                    <br><small> " + data.infoTributaria.claveAcceso + @"</small></div>
                                </div>

                            </div>

                        </div>
                    </div> " + GetInfoComprobante(data) + @"
                    </div>
                    <div class=""row"">
                        
                           " + GetInfoAdicional(data) + GetTotals(data) + @"
                        
                    </div>
                    <div class=""row"">
                        <div class=""col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"">
                            <div class=""form-group"">
                                <labelobs"">Observación:</label>
                                <textarea name=""obs"" id=""obs"" class=""form-control"" ng-model=""Factura.obs""></textarea>
                            </div>
                        </div>
                    </div>";
        return doc;
    }

    public static string GetInfoTrib(ComprobanteElectronico data)
    {
        var infoTrib = string.Empty;
        switch (data.codDoc)
        {
            case "01":
                infoTrib = @"<h6>
                                        <label>Dirección Sucursal: </label>
                                        " + data.infoFactura.dirEstablecimiento + @"
                                    </h6>
                                    <br>
                                    <h6>
                                        <label>
                                            Contribuyente
                                            Especial Nro.
                                        </label>
                                        " + data.infoFactura.contribuyenteEspecial + @"
                                    </h6>
                                    <h6>
                                        <label>OBLIGADO A LLEVAR CONTABILIDAD </label>
                                        " + data.infoFactura.obligadoContabilidad + @"
                                    </h6>";
                break;
            case "04":
                infoTrib = @"<h5>
                                        <label>Dirección Sucursal: </label>
                                        " + data.infoNotaCredito.dirEstablecimiento + @"
                                    </h5>
                                    <br>
                                    <h5 ng-show="""">
                                        <label data.infoFactura.contribuyenteEspecial.length > 0"">
                                            Contribuyente
                                            Especial Nro.
                                        </label>
                                        " + data.infoNotaCredito.contribuyenteEspecial + @"
                                    </h5>
                                    <h5>
                                        <label>OBLIGADO A LLEVAR CONTABILIDAD </label>
                                        " + data.infoNotaCredito.obligadoContabilidad + @"
                                    </h5>";
                break;
            case "07":
                infoTrib = @"<h5>
                                        <label>Dirección Sucursal: </label>
                                        " + data.infoCompRetencion.dirEstablecimiento + @"
                                    </h5>
                                    <br>
                                    <h5 ng-show="""">
                                        <label data.infoFactura.contribuyenteEspecial.length > 0"">
                                            Contribuyente
                                            Especial Nro.
                                        </label>
                                        " + data.infoCompRetencion.contribuyenteEspecial + @"
                                    </h5>
                                    <h5>
                                        <label>OBLIGADO A LLEVAR CONTABILIDAD </label>
                                        " + data.infoCompRetencion.obligadoContabilidad + @"
                                    </h5>";
                break;
        }

        return infoTrib;
    }

    public static string GetInfoComprobante(ComprobanteElectronico data)
    {
        var infoComp = string.Empty;
        switch (data.codDoc)
        {
            case "01":
                infoComp = @" <div class=""row"">
                        <div class=""col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"">
                            <div class=""card border border-dark rounded"">
                                <div class=""card-body"">
                                    <div class=""row"">
                                        <div class=""col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8"">
                                            <h5>
                                                <label>Razón Social / Nombres y Apellidos: </label>
                                                " + data.infoFactura.razonSocialComprador + @"
                                            </h5>
                                            <br>
                                            <h5>
                                                <label>Fecha Emisión: </label>
                                                " + data.infoFactura.fechaEmision + @"
                                            </h5>
                                        </div>
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                <label>Identificación: </label>
                                                " + data.infoFactura.identificacionComprador + @"
                                            </h5><br>

                                                <h5> <label>Guía Remisión: </label>
                                                " + data.infoFactura.guiaRemision + @"
                                            </h5>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class=""row"">
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                <label>Dirección: </label>
                                            </h5>
                                        </div>
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                " + data.infoFactura.direccionComprador + @"
                                            </h5>
                                        </div>
                                    </div>                                 </div>
                            </div>
                        </div>
                        <br>" + @"<div class=""table-responsive"">
                                        <table class=""table table-borderded"">
                                            <thead>
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Código Auxiliar</th>
                                                    <th>Cantidad</th>
                                                    <th>Descripción</th>
                                                    <th>Detalle Adicional</th>
                                                    <th>Detalle Adicional</th>
                                                    <th>Detalle Adicional</th>
                                                    <th>Precio Unitario</th>
                                                    <th>Descuento</th>
                                                    <th>Precio Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>" + GetDetails(data) + @"</tbody>
                                        </table>
                                    </div>";
                ;
                break;
            case "04":
                infoComp = @" <div class=""row"">
                        <div class=""col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"">
                            <div class=""card border border-dark rounded"">
                                <div class=""card-body"">
                                    <div class=""row"">
                                        <div class=""col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8"">
                                            <h5>
                                                <label>Razón Social / Nombres y Apellidos: </label>
                                                " + data.infoNotaCredito.razonSocialComprador + @"
                                            </h5>
                                            <br>
                                            <h5>
                                                <label>Fecha Emisión: </label>
                                                " + data.infoNotaCredito.fechaEmision + @"
                                            </h5>
                                        </div>
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                <label>Identificación: </label>
                                                " + data.infoNotaCredito.identificacionComprador + @"
                                            </h5>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class=""row"">
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                <label>Comprobante que se modifica: </label>
                                            </h5>
                                        </div>
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                " + data.infoNotaCredito.codDocModificado + @"
                                            </h5>
                                        </div>
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                " + data.infoNotaCredito.numDocModificado + @"
                                            </h5>
                                        </div>
                                    </div>

                                    <div class=""row"">
                                        <div class=""col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6"">
                                            <h5>
                                                <label>Fecha Emisión comprobante a modificar: </label>
                                            </h5>
                                        </div>
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                " + data.infoNotaCredito.fechaEmisionDocSustento + @"
                                            </h5>
                                        </div>
                                    </div>
                                    <div class=""row"">
                                        <div class=""col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6"">
                                            <h5>
                                                <label>Razón de Modificación: </label>
                                            </h5>
                                        </div>
                                        <div class=""col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4"">
                                            <h5>
                                                " + data.infoNotaCredito.motivo + @"
                                            </h5>
                                        </div>
                                    </div>
 <div class=""table-responsive"">
                                        <table class=""table table-borderded"">
                                            <thead>
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Código Auxiliar</th>
                                                    <th>Cantidad</th>
                                                    <th>Descripción</th>
                                                    <th>Detalle Adicional</th>
                                                    <th>Detalle Adicional</th>
                                                    <th>Detalle Adicional</th>
                                                    <th>Precio Unitario</th>
                                                    <th>Descuento</th>
                                                    <th>Precio Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>" + GetDetails(data);

                infoComp += @"</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>";
                break;
        }

        return infoComp;
    }

    public static string GetDetails(ComprobanteElectronico data)
    {
        var details = string.Empty;
        switch (data.codDoc)
        {
            case "01":
                foreach (var item in data.detalles)
                {
                    details += @"<tr class=""small"">
                                                    <td> " + item.codigoPrincipal + @" </td >
                                                    <td> " + item.codigoAuxiliar + @" </td >
                                                    <td> " + item.cantidad + @" </td>
                                                    <td> " + item.descripcion + @" </td >
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td class=""text-right"">" + item.precioUnitario + @"</td>
                                                    <td class=""text-right"">" + item.descuento + @"</td>
                                                    <td class=""text-right"">" + item.precioTotalSinImpuesto + @"</td>
                                                </tr>";
                }

                break;
            case "04":
                foreach (var item in data.detalles)
                {
                    details += @"<tr class=""small"">
                                                    <td> " + item.codigoPrincipal + @" </td >
                                                    <td> " + item.codigoAuxiliar + @" </td >
                                                    <td> " + item.cantidad + @" </td>
                                                    <td> " + item.descripcion + @" </td >
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td class=""text-right"">" + item.precioUnitario + @"</td>
                                                    <td class=""text-right"">" + item.descuento + @"</td>
                                                    <td class=""text-right"">" + item.precioTotalSinImpuesto + @"</td>
                                                </tr>";
                }

                break;
        }

        return details;
    }

    public static string GetInfoAdicional(ComprobanteElectronico data)
    {
        if (data.infoAdicional == null)
        {
            return string.Empty;
        }

        var info =
            @"<div class=""col-xl-7 col-lg-7 col-md-7 col-sm-7 col-7""><div class=""card border border-dark rounded"" ng-show=""infoAdicional.length > 0"">
                                <div class=""card-body"">

                                                <table class=""table table-borderless"">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>";
        foreach (var item in data.infoAdicional)
        {
            info += @"<tr><td>" + item.nombre + @"</td>
                <td>" + item.valor + @"</td ></tr>";
        }

        info += @"</tbody></table></div></div>
                        </div>";
        return info;
    }

    public static string GetTotals(ComprobanteElectronico data)
    {
        var totals = string.Empty;
        double subtotalIva0 = 0;
        double subtotal12 = 0;
        var subtotalNoObjetoIva = 0.00;
        var subtotalExcentoIva = 0.00;
        var ice = 0.00;
        var iva12 = 0.00;
        var IRBPNR = 0.00;

        totals = @"<div class=""col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5"">
                            <div class=""table-responsive"">
                                <h5><strong></strong></h5>
                                <table class=""table table-bordered"">
                                    <tbody>";

        switch (data.codDoc)
        {
            case "01":
                foreach (var item in data.infoFactura.totalImpuestos)
                {
                    if (item.codigo == "2" && item.codigoPorcentaje == "2")
                    {
                        totals += @"<tr>
                                            <td class=""text-right""><strong>SubTotal Iva 12%</strong></td>
                                            <td class=""text-right"">" +
                                  Convert.ToString(subtotal12 += Convert.ToDouble(item.baseImponible)) + @"</td>
                                        </tr>";
                    }

                    if (item.codigo == "2" && item.codigoPorcentaje == "0")
                    {
                        totals += @"<tr>
                                            <td class=""text-right""><strong>SubTotal Iva 0%</strong></td>
                                            <td class=""text-right"">" +
                                  Convert.ToString(subtotalIva0 += Convert.ToDouble(item.baseImponible)) + @"</td>
                                        </tr>";
                    }

                    if (item.codigo == "2" && item.codigoPorcentaje == "6")
                    {
                        totals += @"<tr>
                                            <td class=""text-right""><strong>SubTotal No Objeto Iva</strong></td>
                                            <td class=""text-right"">" +
                                  Convert.ToString(subtotalNoObjetoIva += Convert.ToDouble(item.baseImponible)) +
                                  @"</td>
                                        </tr>";
                    }

                    if (item.codigo == "2" && item.codigoPorcentaje == "7")
                    {
                        totals += @"<tr>
                                            <td class=""text-right""><strong>SubTotal Excento Iva</strong></td>
                                            <td class=""text-right"">" +
                                  Convert.ToString(subtotalExcentoIva += Convert.ToDouble(item.baseImponible)) + @"</td>
                                        </tr>";
                    }

                    totals += @"<tr>
                                            <td class=""text-right""><strong>Total Sin Impuestos</strong></td>
                                            <td class=""text-right"">" + data.infoFactura.totalSinImpuestos + @"</td>
                                        </tr>";
                    if (item.codigo == "3")
                    {
                        totals += @"<tr>
                                            <td class=""text-right""><strong>ICE</strong></td>
                                            <td class=""text-right"">" +
                                  Convert.ToString(ice += Convert.ToDouble(item.valor)) + @"</td>
                                        </tr>";
                    }

                    if (item.codigo == "2" && item.codigoPorcentaje == "2")
                    {
                        totals += @"<tr>
                                            <td class=""text-right""><strong>IVA 12%</strong></td>
                                            <td class=""text-right"">" +
                                  Convert.ToString(iva12 += Convert.ToDouble(item.valor)) + @"</td>
                                        </tr>";
                    }

                    if (item.codigo == "5")
                    {
                        totals += @"<tr>
                                            <td class=""text-right""><strong>IRBPNR</strong></td>
                                            <td class=""text-right"">" +
                                  Convert.ToString(IRBPNR += Convert.ToDouble(item.valor)) + @"</td>
                                        </tr>";
                    }
                }

                totals += @" <tr><td class=""text-right""><strong>Propina</strong></td>
                                            <td class=""text-right"">" + data.infoFactura.propina + @"</td>
                                        </tr>";
                totals += @" <tr><td class=""text-right""><strong>Valor Total</strong></td>
                                            <td class=""text-right"">" + data.infoFactura.importeTotal + @"</td>
                                        </tr>";
                break;
            case "04":

                break;
        }

        ;
        totals += @"</tbody>
                                </table>
                            </div>
                            <h4 class=""float-right""><strong></strong></h4><br>
                            <h4 class=""float-right""><strong></strong></h4>
                        </div>";
        return totals;
    }
}
