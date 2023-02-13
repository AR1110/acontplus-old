using Domain.FactElect;
using System.Xml;

namespace BL.FactElect
{
    public class DataXmlComprobante
    {
        public bool GetData(XmlDocument xmlSri, ref ComprobanteElectronicoXml comp, ref string message)
        {
            bool _resp = true;
            try
            {
                XmlNode nodeAuth = xmlSri.GetElementsByTagName("autorizacion")[0];
                XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                XmlDocument xmlComp = new XmlDocument();
                xmlComp.LoadXml(nodeComp.InnerText);

                XmlNode nodeInfoTrib = xmlComp.GetElementsByTagName("infoTributaria")[0];
                string codDoc = nodeInfoTrib.SelectSingleNode("codDoc").InnerText;
                string versionComp = string.Empty;

                switch (codDoc)
                {
                    case "01":
                        XmlNode nodeFact = xmlComp.GetElementsByTagName("factura")[0];
                        versionComp = nodeFact.Attributes["version"].Value;
                        break;
                    case "03":
                        XmlNode nodeLiq = xmlComp.GetElementsByTagName("liquidacionCompra")[0];
                        versionComp = nodeLiq.Attributes["version"].Value;
                        break;
                    case "04":
                        XmlNode nodeNC = xmlComp.GetElementsByTagName("notaCredito")[0];
                        versionComp = nodeNC.Attributes["version"].Value;
                        break;
                    case "05":
                        XmlNode nodeND = xmlComp.GetElementsByTagName("notaDebito")[0];
                        versionComp = nodeND.Attributes["version"].Value;
                        break;
                    case "06":
                        XmlNode nodeGR = xmlComp.GetElementsByTagName("guiaRemision")[0];
                        versionComp = nodeGR.Attributes["version"].Value;
                        break;
                    case "07":
                        XmlNode nodeRet = xmlComp.GetElementsByTagName("comprobanteRetencion")[0];
                        versionComp = nodeRet.Attributes["version"].Value;
                        break;
                    default:
                        break;
                }

                comp.infoTributaria = new InfoTributaria
                {
                    ambiente = nodeInfoTrib.SelectSingleNode("ambiente").InnerText,
                    tipoEmision = nodeInfoTrib.SelectSingleNode("tipoEmision").InnerText,
                    razonSocial = nodeInfoTrib.SelectSingleNode("razonSocial").InnerText,
                    nombreComercial = (nodeInfoTrib.SelectSingleNode("nombreComercial") == null) ? "" : nodeInfoTrib.SelectSingleNode("nombreComercial").InnerText,
                    ruc = nodeInfoTrib.SelectSingleNode("ruc").InnerText,
                    claveAcceso = nodeInfoTrib.SelectSingleNode("claveAcceso").InnerText,
                    codDoc = nodeInfoTrib.SelectSingleNode("codDoc").InnerText,
                    estab = nodeInfoTrib.SelectSingleNode("estab").InnerText,
                    ptoEmi = nodeInfoTrib.SelectSingleNode("ptoEmi").InnerText,
                    secuencial = nodeInfoTrib.SelectSingleNode("secuencial").InnerText,
                    dirMatriz = nodeInfoTrib.SelectSingleNode("dirMatriz").InnerText
                };

                switch (codDoc)
                {
                    case "01":
                        XmlNode nodeInfoFactura = xmlComp.GetElementsByTagName("infoFactura")[0];
                        if (nodeInfoFactura != null)
                        {
                            InfoFactura infoFac = new InfoFactura();
                            infoFac.fechaEmision = nodeInfoFactura.SelectSingleNode("fechaEmision").InnerText;
                            infoFac.dirEstablecimiento = (nodeInfoFactura.SelectSingleNode("dirEstablecimiento") == null) ? "" : nodeInfoFactura.SelectSingleNode("dirEstablecimiento").InnerText;
                            infoFac.contribuyenteEspecial = (nodeInfoFactura.SelectSingleNode("contribuyenteEspecial") == null) ? "" : nodeInfoFactura.SelectSingleNode("contribuyenteEspecial").InnerText;
                            infoFac.obligadoContabilidad = nodeInfoFactura.SelectSingleNode("obligadoContabilidad").InnerText;
                            infoFac.tipoIdentificacionComprador = nodeInfoFactura.SelectSingleNode("tipoIdentificacionComprador").InnerText;
                            infoFac.razonSocialComprador = nodeInfoFactura.SelectSingleNode("razonSocialComprador").InnerText;
                            infoFac.identificacionComprador = nodeInfoFactura.SelectSingleNode("identificacionComprador").InnerText;
                            infoFac.guiaRemision = (nodeInfoFactura.SelectSingleNode("guiaRemision") == null) ? "" : nodeInfoFactura.SelectSingleNode("guiaRemision").InnerText;
                            infoFac.totalSinImpuestos = nodeInfoFactura.SelectSingleNode("totalSinImpuestos").InnerText;
                            infoFac.totalDescuento = nodeInfoFactura.SelectSingleNode("totalDescuento").InnerText;
                            infoFac.propina = (nodeInfoFactura.SelectSingleNode("propina") == null) ? "" : nodeInfoFactura.SelectSingleNode("propina").InnerText;
                            infoFac.importeTotal = nodeInfoFactura.SelectSingleNode("importeTotal").InnerText;
                            infoFac.moneda = (nodeInfoFactura.SelectSingleNode("moneda") == null) ? "" : nodeInfoFactura.SelectSingleNode("moneda").InnerText;
                            comp.Create(codDoc, infoFac);
                        }
                        AddTotalTaxes(comp, xmlComp.GetElementsByTagName("totalConImpuestos")[0]);
                        if (xmlComp.GetElementsByTagName("pagos")[0] != null) { AddPayments(comp, xmlComp.GetElementsByTagName("pagos")[0]); }
                        AddDetails(comp, xmlComp.GetElementsByTagName("detalles")[0]);
                        if (xmlComp.GetElementsByTagName("infoAdicional")[0] != null) { AddInfoAdicional(comp, xmlComp.GetElementsByTagName("infoAdicional")[0]); }
                        break;
                    case "04":
                        XmlNode nodeInfoNotaCredito = xmlComp.GetElementsByTagName("infoNotaCredito")[0];


                        break;
                    case "07":
                        XmlNode nodeInfoCompRetencion = xmlComp.GetElementsByTagName("infoCompRetencion")[0];
                        if (nodeInfoCompRetencion != null)
                        {
                            InfoCompRetencion infoRet = new InfoCompRetencion();
                            infoRet.fechaEmision = nodeInfoCompRetencion.SelectSingleNode("fechaEmision").InnerText;
                            infoRet.dirEstablecimiento = (nodeInfoCompRetencion.SelectSingleNode("dirEstablecimiento") == null) ? "" : nodeInfoCompRetencion.SelectSingleNode("dirEstablecimiento").InnerText;
                            infoRet.contribuyenteEspecial = (nodeInfoCompRetencion.SelectSingleNode("contribuyenteEspecial") == null) ? "" : nodeInfoCompRetencion.SelectSingleNode("contribuyenteEspecial").InnerText;
                            infoRet.obligadoContabilidad = nodeInfoCompRetencion.SelectSingleNode("obligadoContabilidad").InnerText;
                            infoRet.tipoIdentificacionSujetoRetenido = nodeInfoCompRetencion.SelectSingleNode("tipoIdentificacionSujetoRetenido").InnerText;
                            infoRet.razonSocialSujetoRetenido = nodeInfoCompRetencion.SelectSingleNode("razonSocialSujetoRetenido").InnerText;
                            infoRet.identificacionSujetoRetenido = nodeInfoCompRetencion.SelectSingleNode("identificacionSujetoRetenido").InnerText;
                            infoRet.periodoFiscal = (nodeInfoCompRetencion.SelectSingleNode("periodoFiscal") == null) ? "" : nodeInfoCompRetencion.SelectSingleNode("periodoFiscal").InnerText;
                            if (versionComp == "2.0.0")
                            {

                            }
                            else
                            {
                                AddImpuestoRetencion(comp, xmlComp.GetElementsByTagName("impuestos")[0]);
                            }
                            comp.Create(codDoc, infoRet);
                            if (xmlComp.GetElementsByTagName("infoAdicional")[0] != null) { AddInfoAdicional(comp, xmlComp.GetElementsByTagName("infoAdicional")[0]); }
                        }

                        break;
                    default:
                        break;
                }


            }
            catch (Exception ex)
            {
                _resp = false;
                message = "Error al obtener la informacion del comprobante: " + ex.Message;
            }
            return _resp;
        }
        public void AddTotalTaxes(ComprobanteElectronicoXml comp, XmlNode impuestos)
        {
            var totalImpuestos = new List<TotalImpuesto>();
            foreach (XmlNode item in impuestos)
            {
                TotalImpuesto totalImpuesto = new TotalImpuesto();
                totalImpuesto.codigo = item.SelectSingleNode("codigo").InnerText;
                totalImpuesto.codigoPorcentaje = item.SelectSingleNode("codigoPorcentaje").InnerText;
                totalImpuesto.descuentoAdicional = (item.SelectSingleNode("descuentoAdicional") == null) ? "" : item.SelectSingleNode("descuentoAdicional").InnerText;
                totalImpuesto.baseImponible = item.SelectSingleNode("baseImponible").InnerText;
                totalImpuesto.valor = item.SelectSingleNode("valor").InnerText;
                totalImpuestos.Add(totalImpuesto);
            }
            comp.CreateTotalTaxes(totalImpuestos);
        }
        public void AddPayments(ComprobanteElectronicoXml comp, XmlNode payments)
        {
            var pagos = new List<Pago>();
            foreach (XmlNode item in payments)
            {
                Pago pago = new Pago();
                pago.formaPago = item.SelectSingleNode("formaPago").InnerText;
                pago.total = item.SelectSingleNode("total").InnerText;
                pago.plazo = (item.SelectSingleNode("plazo") == null) ? "" : item.SelectSingleNode("plazo").InnerText;
                pago.unidadTiempo = (item.SelectSingleNode("unidadTiempo") == null) ? "" : item.SelectSingleNode("unidadTiempo").InnerText;
                pagos.Add(pago);
            }
            comp.CreatePayments(pagos);
        }
        public void AddDetails(ComprobanteElectronicoXml comp, XmlNode details)
        {
            var detalles = new List<Detalle>();
            var impuestos = new List<Impuesto>();
            foreach (XmlNode item in details)
            {
                Detalle detail = new Detalle();
                detail.codigoPrincipal = item.SelectSingleNode("codigoPrincipal").InnerText;
                detail.codigoAuxiliar = (item.SelectSingleNode("codigoAuxiliar") == null) ? "" : item.SelectSingleNode("codigoAuxiliar").InnerText;
                detail.descripcion = item.SelectSingleNode("descripcion").InnerText;
                detail.cantidad = item.SelectSingleNode("cantidad").InnerText;
                detail.precioUnitario = item.SelectSingleNode("precioUnitario").InnerText;
                detail.descuento = item.SelectSingleNode("descuento").InnerText;
                detail.precioTotalSinImpuesto = item.SelectSingleNode("precioTotalSinImpuesto").InnerText;

                foreach (XmlElement taxes in item.SelectNodes("impuestos"))
                {
                    Impuesto tax = new Impuesto();
                    tax.codArticulo = detail.codigoPrincipal;
                    tax.codigo = taxes.GetElementsByTagName("codigo")[0].InnerText;
                    tax.codigoPorcentaje = taxes.GetElementsByTagName("codigoPorcentaje")[0].InnerText;
                    tax.tarifa = taxes.GetElementsByTagName("tarifa")[0].InnerText;
                    tax.baseImponible = taxes.GetElementsByTagName("baseImponible")[0].InnerText;
                    tax.valor = taxes.GetElementsByTagName("valor")[0].InnerText;
                    impuestos.Add(tax);
                }
                detalles.Add(detail);
            }
            comp.CreateTaxes(impuestos);

            comp.CreateDetails(detalles);
        }
        public void AddInfoAdicional(ComprobanteElectronicoXml comp, XmlNode infoAdi)
        {
            var infoAdicionals = new List<InfoAdicional>();
            foreach (XmlNode item in infoAdi)
            {
                InfoAdicional info = new InfoAdicional();
                info.nombre = item.Attributes.GetNamedItem("nombre").Value;
                info.valor = item.InnerText;
                infoAdicionals.Add(info);
            }
            comp.CreateAdditionalInfo(infoAdicionals);
        }
        public void AddImpuestoRetencion(ComprobanteElectronicoXml comp, XmlNode impuestosRet)
        {
            var impuestos = new List<ImpuestoRetencion>();
            foreach (XmlElement taxes in impuestosRet)
            {
                ImpuestoRetencion tax = new ImpuestoRetencion(); 
                tax.codigo = taxes.GetElementsByTagName("codigo")[0].InnerText;
                tax.codigoRetencion = taxes.GetElementsByTagName("codigoRetencion")[0].InnerText;
                tax.baseImponible = taxes.GetElementsByTagName("baseImponible")[0].InnerText;
                tax.porcentajeRetener = taxes.GetElementsByTagName("porcentajeRetener")[0].InnerText;
                tax.valorRetenido = taxes.GetElementsByTagName("valorRetenido")[0].InnerText;
                tax.codDocSustento = taxes.GetElementsByTagName("codDocSustento")[0].InnerText;
                tax.numDocSustento = taxes.GetElementsByTagName("numDocSustento")[0].InnerText;
                tax.fechaEmisionDocSustento = taxes.GetElementsByTagName("fechaEmisionDocSustento")[0].InnerText;
                impuestos.Add(tax);
            }
            comp.CreateRetencionTaxes(impuestos);
        }
    }
}
