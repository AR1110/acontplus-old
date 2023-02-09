using System.Xml;

namespace Domain.Models.FE
{
    public class GetDataXmlComprobante
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

                XmlNode nodeInfoComprobante = null;
                switch (codDoc)
                {
                    case "01":
                        nodeInfoComprobante = xmlComp.GetElementsByTagName("infoFactura")[0];
                        AddTotalTaxes(comp, xmlComp.GetElementsByTagName("totalConImpuestos")[0]);
                        if (xmlComp.GetElementsByTagName("pagos")[0] != null) { AddPayments(comp, xmlComp.GetElementsByTagName("pagos")[0]); }
                        AddDetails(comp, xmlComp.GetElementsByTagName("detalles")[0]);
                        if (xmlComp.GetElementsByTagName("infoAdicional")[0] != null) { AddInfoAdicional(comp, xmlComp.GetElementsByTagName("infoAdicional")[0]); }
                        break;
                    case "04":
                        nodeInfoComprobante = xmlComp.GetElementsByTagName("infoNotaCredito")[0];


                        break;
                    case "07":
                        nodeInfoComprobante = xmlComp.GetElementsByTagName("infoCompRetencion")[0];



                        break;
                    default:
                        break;
                }
                if (nodeInfoComprobante != null)
                {
                    comp.infoComprobante = new InfoComprobante();
                    comp.infoComprobante.fechaEmision = nodeInfoComprobante.SelectSingleNode("fechaEmision").InnerText;
                    comp.infoComprobante.dirEstablecimiento = (nodeInfoComprobante.SelectSingleNode("dirEstablecimiento") == null) ? "" : nodeInfoComprobante.SelectSingleNode("dirEstablecimiento").InnerText;
                    comp.infoComprobante.contribuyenteEspecial = (nodeInfoComprobante.SelectSingleNode("contribuyenteEspecial") == null) ? "" : nodeInfoComprobante.SelectSingleNode("contribuyenteEspecial").InnerText;
                    comp.infoComprobante.obligadoContabilidad = nodeInfoComprobante.SelectSingleNode("obligadoContabilidad").InnerText;
                    comp.infoComprobante.tipoIdentificacionComprador = nodeInfoComprobante.SelectSingleNode("tipoIdentificacionComprador").InnerText;
                    comp.infoComprobante.razonSocialComprador = nodeInfoComprobante.SelectSingleNode("razonSocialComprador").InnerText;
                    comp.infoComprobante.identificacionComprador = nodeInfoComprobante.SelectSingleNode("identificacionComprador").InnerText;
                    comp.infoComprobante.guiaRemision = (nodeInfoComprobante.SelectSingleNode("guiaRemision") == null) ? "" : nodeInfoComprobante.SelectSingleNode("guiaRemision").InnerText;
                    comp.infoComprobante.totalSinImpuestos = nodeInfoComprobante.SelectSingleNode("totalSinImpuestos").InnerText;
                    comp.infoComprobante.totalDescuento = nodeInfoComprobante.SelectSingleNode("totalDescuento").InnerText;
                    comp.infoComprobante.propina = (nodeInfoComprobante.SelectSingleNode("propina") == null) ? "" : nodeInfoComprobante.SelectSingleNode("propina").InnerText;
                    comp.infoComprobante.importeTotal = nodeInfoComprobante.SelectSingleNode("importeTotal").InnerText;
                    comp.infoComprobante.moneda = (nodeInfoComprobante.SelectSingleNode("moneda") == null) ? "" : nodeInfoComprobante.SelectSingleNode("moneda").InnerText;
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
            comp.totalImpuestos = new List<TotalImpuesto>();
            foreach (XmlNode item in impuestos)
            {
                TotalImpuesto totalImpuesto = new TotalImpuesto();
                totalImpuesto.codigo = item.SelectSingleNode("codigo").InnerText;
                totalImpuesto.codigoPorcentaje = item.SelectSingleNode("codigoPorcentaje").InnerText;
                totalImpuesto.descuentoAdicional = (item.SelectSingleNode("descuentoAdicional") == null) ? "" : item.SelectSingleNode("descuentoAdicional").InnerText;
                totalImpuesto.baseImponible = item.SelectSingleNode("baseImponible").InnerText;
                totalImpuesto.valor = item.SelectSingleNode("valor").InnerText;
                comp.totalImpuestos.Add(totalImpuesto);
            }
        }
        public void AddPayments(ComprobanteElectronicoXml comp, XmlNode payments)
        {
            comp.pagos = new List<Pago>();
            foreach (XmlNode item in payments)
            {
                Pago pago = new Pago();
                pago.formaPago = item.SelectSingleNode("formaPago").InnerText;
                pago.total = item.SelectSingleNode("total").InnerText;
                pago.plazo = (item.SelectSingleNode("plazo") == null) ? "" : item.SelectSingleNode("plazo").InnerText;
                pago.unidadTiempo = (item.SelectSingleNode("unidadTiempo") == null) ? "" : item.SelectSingleNode("unidadTiempo").InnerText;
                comp.pagos.Add(pago);
            }
        }
        public void AddDetails(ComprobanteElectronicoXml comp, XmlNode details)
        {
            comp.detalles = new List<Detalle>();
            comp.impuestos = new List<ImpuestoComp>();
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
                    ImpuestoComp tax = new ImpuestoComp();
                    tax.codArticulo = detail.codigoPrincipal;
                    tax.codigo = taxes.GetElementsByTagName("codigo")[0].InnerText;
                    tax.codigoPorcentaje = taxes.GetElementsByTagName("codigoPorcentaje")[0].InnerText;
                    tax.tarifa = taxes.GetElementsByTagName("tarifa")[0].InnerText;
                    tax.baseImponible = taxes.GetElementsByTagName("baseImponible")[0].InnerText;
                    tax.valor = taxes.GetElementsByTagName("valor")[0].InnerText;
                    comp.impuestos.Add(tax);
                }
                comp.detalles.Add(detail);
            }
        }
        public void AddInfoAdicional(ComprobanteElectronicoXml comp, XmlNode infoAdi)
        {
            comp.infoAdicionals = new List<InfoAdicional>();
            foreach (XmlNode item in infoAdi)
            {
                InfoAdicional info = new InfoAdicional();
                info.nombre = item.Attributes.GetNamedItem("nombre").Value;
                info.valor = item.InnerText;
                comp.infoAdicionals.Add(info);
            }
        }
    }
}
