using System;
using System.Data;
using System.IO;
using System.Text;
using System.Xml;

namespace SignerWS
{
    public class ComprobanteXml
    {
        public bool Create(string codDoc, DataSet ds, ref string xml)
        {
            bool _response = false;
            switch (codDoc)
            {
                case "01":
                    xml = XmlFactura(ds);
                    if (!string.IsNullOrEmpty(xml))
                    {
                        _response = true;
                    }
                    break;
                case "03":
                    xml = XmlLiquidacionCompra(ds);
                    if (!string.IsNullOrEmpty(xml))
                    {
                        _response = true;
                    }
                    break;
                case "04":
                    xml = XmlNotaCredito(ds);
                    if (!string.IsNullOrEmpty(xml))
                    {
                        _response = true;
                    }
                    break;
                case "05":
                    //XmlNotaDebito(ds);
                    break;
                case "06":
                    xml = XmlGuiaRemision(ds);
                    if (!string.IsNullOrEmpty(xml))
                    {
                        _response = true;
                    }
                    break;
                case "07":
                    if (ds.Tables[0].Rows[0]["versionComp"].ToString() == "1.0.0")
                    {
                       xml = XmlRetencionV1(ds);
                    }
                    else
                    {
                        xml = XmlRetencion(ds);
                    }

                    if (!string.IsNullOrEmpty(xml))
                    {
                        _response = true;
                    }
                    break;
                default:
                    break;
            }
            return _response;
        }
        public string XmlFactura(DataSet ds)
        {
            string xml = string.Empty;

            MemoryStream stream = new MemoryStream();
            TextWriter DocumentText = new StreamWriter(stream);
            XmlTextWriter wr = new XmlTextWriter(DocumentText);

            DataTable infoTributaria = ds.Tables[0];
            DataTable infoFactura = ds.Tables[1];
            DataTable payment = ds.Tables[2];
            DataTable taxes = ds.Tables[3];
            DataTable detail = ds.Tables[4];
            DataTable infoAdicional = ds.Tables[5];

            wr.WriteStartDocument(true);
            wr.Formatting = System.Xml.Formatting.Indented;
            wr.Indentation = 2;

            wr.WriteStartElement("factura");

            wr.WriteStartAttribute("id");
            wr.WriteString("comprobante");
            wr.WriteEndAttribute();

            wr.WriteStartAttribute("version");
            wr.WriteString("1.1.0");
            wr.WriteEndAttribute();

            wr.WriteStartElement("infoTributaria");

            //------------1 max1 num-------------\\
            wr.WriteStartElement("ambiente");
            wr.WriteString(infoTributaria.Rows[0]["ambiente"].ToString());
            wr.WriteEndElement();

            //------------1 max1 num--------------\\
            wr.WriteStartElement("tipoEmision");
            wr.WriteString(infoTributaria.Rows[0]["tipoEmision"].ToString());
            wr.WriteEndElement();

            //------------max 300 alfanum------------\\
            wr.WriteStartElement("razonSocial");
            wr.WriteString(infoTributaria.Rows[0]["razonSocial"].ToString());
            wr.WriteEndElement();

            //------------max 300 alfanum------------\\
            wr.WriteStartElement("nombreComercial");
            wr.WriteString(infoTributaria.Rows[0]["nombreComercial"].ToString());
            wr.WriteEndElement();

            //------------max 13 num------------------\\
            wr.WriteStartElement("ruc");
            wr.WriteString(infoTributaria.Rows[0]["ruc"].ToString());
            wr.WriteEndElement();

            //------------max 49 num-------------------\\
            wr.WriteStartElement("claveAcceso");
            wr.WriteString(infoTributaria.Rows[0]["claveAcceso"].ToString());
            wr.WriteEndElement();

            //---......(1 factura etc) num max 2---\\
            wr.WriteStartElement("codDoc");
            wr.WriteString(infoTributaria.Rows[0]["codDoc"].ToString());
            wr.WriteEndElement();

            //-------------num max 3---------------\\
            wr.WriteStartElement("estab");
            wr.WriteString(infoTributaria.Rows[0]["estab"].ToString());
            wr.WriteEndElement();

            //------------num max 3-----------------\\
            wr.WriteStartElement("ptoEmi");
            wr.WriteString(infoTributaria.Rows[0]["ptoEmi"].ToString());
            wr.WriteEndElement();

            //---num max 9 --secuencia de la factura---\\
            wr.WriteStartElement("secuencial");
            wr.WriteString(infoTributaria.Rows[0]["secuencial"].ToString());
            wr.WriteEndElement();

            //------------alfanum max 300-------------\\
            wr.WriteStartElement("dirMatriz");
            wr.WriteString(infoTributaria.Rows[0]["dirMatriz"].ToString());
            wr.WriteEndElement();

            //------Normativa del sri------\\
            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["agenteRetencion"].ToString()))
            {
                wr.WriteStartElement("agenteRetencion");
                wr.WriteString("1");
                wr.WriteEndElement();
            }

            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString()))
            {
                wr.WriteStartElement("contribuyenteRimpe");
                wr.WriteString(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString());
                wr.WriteEndElement();
            }

            wr.WriteEndElement();

            wr.WriteStartElement("infoFactura");

            //------------fecha dd/MM/aaaa------------\\
            wr.WriteStartElement("fechaEmision");
            wr.WriteString(infoFactura.Rows[0]["fechaEmision"].ToString());
            wr.WriteEndElement();

            //------------alfanum max 300--------------\\
            wr.WriteStartElement("dirEstablecimiento");
            wr.WriteString(infoFactura.Rows[0]["dirEstablecimiento"].ToString());
            wr.WriteEndElement();

            //------------Alfanum max 13----------------\\

            if (!string.IsNullOrEmpty(infoFactura.Rows[0]["contribuyenteEspecial"].ToString()))
            {
                wr.WriteStartElement("contribuyenteEspecial");
                wr.WriteString(infoFactura.Rows[0]["contribuyenteEspecial"].ToString());
                wr.WriteEndElement();
            }

            //------------SI || NO texto----------------\\
            wr.WriteStartElement("obligadoContabilidad");
            wr.WriteString(infoFactura.Rows[0]["obligadoContabilidad"].ToString());
            wr.WriteEndElement();

            //-------------num max 2-----------------------\\
            wr.WriteStartElement("tipoIdentificacionComprador");
            wr.WriteString(infoFactura.Rows[0]["tipoIdentificacionComprador"].ToString());
            wr.WriteEndElement();

            //-------------num 15 -------------------------\\

            wr.WriteStartElement("guiaRemision");
            wr.WriteString(infoFactura.Rows[0]["guiaRemision"].ToString());
            wr.WriteEndElement();

            //-------------alfa num max 300-----------------\\
            wr.WriteStartElement("razonSocialComprador");
            wr.WriteString(infoFactura.Rows[0]["razonSocialComprador"].ToString());
            wr.WriteEndElement();

            //-------------alfanum max 20-------------------\\
            wr.WriteStartElement("identificacionComprador");
            wr.WriteString(infoFactura.Rows[0]["identificacionComprador"].ToString());
            wr.WriteEndElement();

            //-------------alfa num max 300-----------------\\
            wr.WriteStartElement("direccionComprador");
            wr.WriteString(infoFactura.Rows[0]["direccionComprador"].ToString());
            wr.WriteEndElement();

            //--------------num max 14----------------------\\
            wr.WriteStartElement("totalSinImpuestos");
            wr.WriteString(infoFactura.Rows[0]["totalSinImpuestos"].ToString());
            wr.WriteEndElement();

            //--------------num max 14------------------------\\
            wr.WriteStartElement("totalDescuento");
            wr.WriteString(infoFactura.Rows[0]["totalDescuento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("totalConImpuestos");
            NodoImpuestos(wr, taxes);
            wr.WriteEndElement();

            //--------------num max 14--------------------------\\
            wr.WriteStartElement("propina");
            wr.WriteString(infoFactura.Rows[0]["propina"].ToString());
            wr.WriteEndElement();

            //--------------num max 14--------------------------\\
            wr.WriteStartElement("importeTotal");
            wr.WriteString(infoFactura.Rows[0]["importeTotal"].ToString());
            wr.WriteEndElement();

            //--------------alfanum max 15--------------------\\
            wr.WriteStartElement("moneda");
            wr.WriteString("Dolar");
            wr.WriteEndElement();

            if (!string.IsNullOrEmpty(infoFactura.Rows[0]["placa"].ToString()))
            {
                wr.WriteStartElement("placa");
                wr.WriteString(infoFactura.Rows[0]["placa"].ToString());
                wr.WriteEndElement();
            }

            //--------------- FORMAS DE PAGO ------------------\\
            wr.WriteStartElement("pagos");
            NodoPagos(wr, payment); //READ METHOD
            wr.WriteEndElement();

            wr.WriteEndElement(); //Cierra infoFactura

            //DETALLE DE FACTURAS

            wr.WriteStartElement("detalles");
            NodoDetalle(wr, detail);
            wr.WriteEndElement();

            //INFO ADICIONAL

            if (infoAdicional.Rows.Count > 0)
            {
                wr.WriteStartElement("infoAdicional");

                NodoInfoAdicional(wr, infoAdicional); //READ METHOD

                wr.WriteEndElement();
            }

            wr.WriteEndElement();

            wr.WriteEndDocument();

            wr.Close();

            xml = Encoding.UTF8.GetString(stream.ToArray());

            return xml;
        }
        public string XmlLiquidacionCompra(DataSet ds)
        {
            string xml = string.Empty;

            MemoryStream stream = new MemoryStream();
            TextWriter DocumentText = new StreamWriter(stream);
            XmlTextWriter wr = new XmlTextWriter(DocumentText);

            DataTable infoTributaria = ds.Tables[0];
            DataTable infoLiquidacionCompra = ds.Tables[1];
            DataTable payment = ds.Tables[2];
            DataTable taxes = ds.Tables[3];
            DataTable detail = ds.Tables[4];
            DataTable infoAdicional = ds.Tables[5];

            wr.WriteStartDocument(true);
            wr.Formatting = System.Xml.Formatting.Indented;
            wr.Indentation = 2;

            wr.WriteStartElement("liquidacionCompra");
            wr.WriteStartAttribute("id");
            wr.WriteString("comprobante");
            wr.WriteEndAttribute();

            wr.WriteStartAttribute("version");
            wr.WriteString("1.1.0");
            wr.WriteEndAttribute();

            wr.WriteStartElement("infoTributaria");
            //------------1 max1 num-------------\\
            wr.WriteStartElement("ambiente");
            wr.WriteString(infoTributaria.Rows[0]["ambiente"].ToString());
            wr.WriteEndElement();

            //------------1 max1 num--------------\\
            wr.WriteStartElement("tipoEmision");
            wr.WriteString(infoTributaria.Rows[0]["tipoEmision"].ToString());
            wr.WriteEndElement();

            //------------max 300 alfanum------------\\
            wr.WriteStartElement("razonSocial");
            wr.WriteString(infoTributaria.Rows[0]["razonSocial"].ToString());
            wr.WriteEndElement();

            //------------max 300 alfanum------------\\
            wr.WriteStartElement("nombreComercial");
            wr.WriteString(infoTributaria.Rows[0]["nombreComercial"].ToString());
            wr.WriteEndElement();

            //------------max 13 num------------------\\
            wr.WriteStartElement("ruc");
            wr.WriteString(infoTributaria.Rows[0]["ruc"].ToString());
            wr.WriteEndElement();

            //------------max 49 num-------------------\\
            wr.WriteStartElement("claveAcceso");
            wr.WriteString(infoTributaria.Rows[0]["claveAcceso"].ToString());
            wr.WriteEndElement();

            //---......(1 factura etc) num max 2---\\
            wr.WriteStartElement("codDoc");
            wr.WriteString(infoTributaria.Rows[0]["codDoc"].ToString());
            wr.WriteEndElement();

            //-------------num max 3---------------\\
            wr.WriteStartElement("estab");
            wr.WriteString(infoTributaria.Rows[0]["estab"].ToString());
            wr.WriteEndElement();

            //------------num max 3-----------------\\
            wr.WriteStartElement("ptoEmi");
            wr.WriteString(infoTributaria.Rows[0]["ptoEmi"].ToString());
            wr.WriteEndElement();

            //---num max 9 --secuencia de la factura---\\
            wr.WriteStartElement("secuencial");
            wr.WriteString(infoTributaria.Rows[0]["secuencial"].ToString());
            wr.WriteEndElement();

            //------------alfanum max 300-------------\\
            wr.WriteStartElement("dirMatriz");
            wr.WriteString(infoTributaria.Rows[0]["dirMatriz"].ToString());
            wr.WriteEndElement();

            //------Normativa del sri------\\
            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["agenteRetencion"].ToString()))
            {
                wr.WriteStartElement("agenteRetencion");
                wr.WriteString("1");
                wr.WriteEndElement();
            }

            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString()))
            {
                wr.WriteStartElement("contribuyenteRimpe");
                wr.WriteString(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString());
                wr.WriteEndElement();
            }

            wr.WriteEndElement();

            wr.WriteStartElement("infoLiquidacionCompra");

            //------------fecha dd/MM/aaaa------------\\
            wr.WriteStartElement("fechaEmision");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["fechaEmision"].ToString());
            wr.WriteEndElement();

            //------------alfanum max 300--------------\\
            wr.WriteStartElement("dirEstablecimiento");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["dirEstablecimiento"].ToString());
            wr.WriteEndElement();

            //------------Alfanum max 13----------------\\
            if (!string.IsNullOrEmpty(infoLiquidacionCompra.Rows[0]["contribuyenteEspecial"].ToString()))
            {
                wr.WriteStartElement("contribuyenteEspecial");
                wr.WriteString(infoLiquidacionCompra.Rows[0]["contribuyenteEspecial"].ToString());
                wr.WriteEndElement();
            }

            //------------SI || NO texto----------------\\
            wr.WriteStartElement("obligadoContabilidad");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["obligadoContabilidad"].ToString());
            wr.WriteEndElement();

            //-------------num max 2-----------------------\\
            wr.WriteStartElement("tipoIdentificacionProveedor");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["tipoIdentificacionProveedor"].ToString());
            wr.WriteEndElement();

            //-------------alfa num max 300-----------------\\
            wr.WriteStartElement("razonSocialProveedor");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["razonSocialProveedor"].ToString());
            wr.WriteEndElement();

            //-------------alfanum max 20-------------------\\
            wr.WriteStartElement("identificacionProveedor");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["identificacionProveedor"].ToString());
            wr.WriteEndElement();

            //-------------alfa num max 300-----------------\\
            wr.WriteStartElement("direccionProveedor");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["direccionProveedor"].ToString());
            wr.WriteEndElement();

            //--------------num max 14----------------------\\
            wr.WriteStartElement("totalSinImpuestos");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["totalSinImpuestos"].ToString());
            wr.WriteEndElement();

            //--------------num max 14------------------------\\
            wr.WriteStartElement("totalDescuento");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["totalDescuento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("totalConImpuestos");
            NodoImpuestos(wr, taxes);
            wr.WriteEndElement();

            wr.WriteStartElement("importeTotal");
            wr.WriteString(infoLiquidacionCompra.Rows[0]["importeTotal"].ToString());
            wr.WriteEndElement();

            //--------------alfanum max 15--------------------\\
            wr.WriteStartElement("moneda");
            wr.WriteString("Dolar");
            wr.WriteEndElement();

            //--------------- FORMAS DE PAGO ------------------\\
            wr.WriteStartElement("pagos");
            NodoPagos(wr, payment); //READ METHOD
            wr.WriteEndElement();

            wr.WriteEndElement(); //Cierra infoLiquidacionCompra

            wr.WriteStartElement("detalles");
            NodoDetalle(wr, detail);
            wr.WriteEndElement();

            //INFO ADICIONAL

            if (infoAdicional.Rows.Count > 0)
            {
                wr.WriteStartElement("infoAdicional");

                NodoInfoAdicional(wr, infoAdicional); //READ METHOD

                wr.WriteEndElement();
            }

            wr.WriteEndElement();

            wr.WriteEndDocument();

            wr.Close();

            //ENVIAMOS A FIRMAR XML
            xml = Encoding.UTF8.GetString(stream.ToArray());

            return xml;
        }
        public string XmlNotaCredito(DataSet ds)
        {
            string xml = string.Empty;

            MemoryStream stream = new MemoryStream();
            TextWriter DocumentText = new StreamWriter(stream);
            XmlTextWriter wr = new XmlTextWriter(DocumentText);

            DataTable infoTributaria = ds.Tables[0];
            DataTable infoNotaCredito = ds.Tables[1];
            DataTable taxes = ds.Tables[2];
            DataTable detail = ds.Tables[3];
            DataTable infoAdicional = ds.Tables[4];


            wr.WriteStartDocument(true);
            wr.Formatting = System.Xml.Formatting.Indented;
            wr.Indentation = 2;

            wr.WriteStartElement("notaCredito");

            wr.WriteStartAttribute("id");
            wr.WriteString("comprobante");
            wr.WriteEndAttribute();

            wr.WriteStartAttribute("version");
            wr.WriteString("1.1.0");
            wr.WriteEndAttribute();

            wr.WriteStartElement("infoTributaria");

            wr.WriteStartElement("ambiente");
            wr.WriteString(infoTributaria.Rows[0]["ambiente"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("tipoEmision");
            wr.WriteString(infoTributaria.Rows[0]["tipoEmision"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("razonSocial");
            wr.WriteString(infoTributaria.Rows[0]["razonSocial"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("nombreComercial");
            wr.WriteString(infoTributaria.Rows[0]["nombreComercial"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("ruc");
            wr.WriteString(infoTributaria.Rows[0]["ruc"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("claveAcceso");
            wr.WriteString(infoTributaria.Rows[0]["claveAcceso"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("codDoc");
            wr.WriteString(infoTributaria.Rows[0]["codDoc"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("estab");
            wr.WriteString(infoTributaria.Rows[0]["estab"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("ptoEmi");
            wr.WriteString(infoTributaria.Rows[0]["ptoEmi"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("secuencial");
            wr.WriteString(infoTributaria.Rows[0]["secuencial"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("dirMatriz");
            wr.WriteString(infoTributaria.Rows[0]["dirMatriz"].ToString());
            wr.WriteEndElement();

            //------Normativa del sri------\\
            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["agenteRetencion"].ToString()))
            {
                wr.WriteStartElement("agenteRetencion");
                wr.WriteString("1");
                wr.WriteEndElement();
            }

            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString()))
            {
                wr.WriteStartElement("contribuyenteRimpe");
                wr.WriteString(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString());
                wr.WriteEndElement();
            }

            wr.WriteEndElement(); //End <infoTributaria>

            wr.WriteStartElement("infoNotaCredito");

            wr.WriteStartElement("fechaEmision");
            wr.WriteString(infoNotaCredito.Rows[0]["fechaEmision"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("dirEstablecimiento");
            wr.WriteString(infoNotaCredito.Rows[0]["dirEstablecimiento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("tipoIdentificacionComprador");
            wr.WriteString(infoNotaCredito.Rows[0]["tipoIdentificacionComprador"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("razonSocialComprador");
            wr.WriteString(infoNotaCredito.Rows[0]["razonSocialComprador"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("identificacionComprador");
            wr.WriteString(infoNotaCredito.Rows[0]["identificacionComprador"].ToString());
            wr.WriteEndElement();

            if (!string.IsNullOrEmpty(infoNotaCredito.Rows[0]["contribuyenteEspecial"].ToString()))
            {
                wr.WriteStartElement("contribuyenteEspecial");
                wr.WriteString(infoNotaCredito.Rows[0]["contribuyenteEspecial"].ToString());
                wr.WriteEndElement();
            }

            wr.WriteStartElement("obligadoContabilidad");
            wr.WriteString(infoNotaCredito.Rows[0]["obligadoContabilidad"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("codDocModificado");
            wr.WriteString(infoNotaCredito.Rows[0]["codDocModificado"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("numDocModificado");
            wr.WriteString(infoNotaCredito.Rows[0]["numDocModificado"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("fechaEmisionDocSustento");
            wr.WriteString(infoNotaCredito.Rows[0]["fechaEmisionDocSustento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("totalSinImpuestos");
            wr.WriteString(infoNotaCredito.Rows[0]["totalSinImpuestos"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("valorModificacion");
            wr.WriteString(infoNotaCredito.Rows[0]["valorModificacion"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("moneda");
            wr.WriteString("Dolar");
            wr.WriteEndElement();

            wr.WriteStartElement("totalConImpuestos");
            NodoImpuestos(wr, taxes);
            wr.WriteEndElement();

            wr.WriteStartElement("motivo");
            wr.WriteString(infoNotaCredito.Rows[0]["fechaEmision"].ToString());
            wr.WriteEndElement();

            wr.WriteEndElement(); //End <infoNotaCredito>

            wr.WriteStartElement("detalles");
            NotaCreditoDetalle(wr, detail);
            wr.WriteEndElement();

            if (infoAdicional.Rows.Count > 0)
            {
                wr.WriteStartElement("infoAdicional");

                NodoInfoAdicional(wr, infoAdicional); //READ METHOD

                wr.WriteEndElement();
            }

            wr.WriteEndElement(); //End <notaCredito>
            wr.Close();

            //ENVIAMOS A FIRMAR XML
            xml = Encoding.UTF8.GetString(stream.ToArray());

            return xml;
        }
        public void NotaCreditoDetalle(XmlTextWriter wr, DataTable detail)
        {
            foreach (DataRow item in detail.Rows)
            {
                wr.WriteStartElement("detalle");

                wr.WriteStartElement("codigoInterno");
                wr.WriteString(item["codigoInterno"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("codigoAdicional");
                wr.WriteString(item["codigoAdicional"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("descripcion");
                wr.WriteString(item["descripcion"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("cantidad");
                wr.WriteString(item["cantidad"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("precioUnitario");
                wr.WriteString(item["precioUnitario"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("descuento");
                wr.WriteString(item["descuento"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("precioTotalSinImpuesto");
                wr.WriteString(item["precioTotalSinImpuesto"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("impuestos");

                wr.WriteStartElement("impuesto");

                wr.WriteStartElement("codigo");
                wr.WriteString(item["codigo"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("codigoPorcentaje");
                wr.WriteString(item["codigoPorcentaje"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("tarifa");
                wr.WriteString(item["tarifa"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("baseImponible");
                wr.WriteString(item["baseImponible"].ToString().ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("valor");
                wr.WriteString(item["valor"].ToString());
                wr.WriteEndElement();

                wr.WriteEndElement(); //End <impuesto>

                wr.WriteEndElement(); //End <impuestos>

                wr.WriteEndElement(); //End <detalle>
            }
        }
        public string XmlGuiaRemision(DataSet ds)
        {
            string xml = string.Empty;

            MemoryStream stream = new MemoryStream();
            TextWriter DocumentText = new StreamWriter(stream);
            XmlTextWriter wr = new XmlTextWriter(DocumentText);

            DataTable infoTributaria = ds.Tables[0];
            DataTable infoGuiaRemision = ds.Tables[1];
            DataTable destinatario = ds.Tables[2];
            DataTable detail = ds.Tables[3];
            DataTable infoAdicional = ds.Tables[4];


            wr.WriteStartDocument(true);
            wr.Formatting = System.Xml.Formatting.Indented;
            wr.Indentation = 2;

            wr.WriteStartElement("guiaRemision");

            wr.WriteStartAttribute("id");
            wr.WriteString("comprobante");
            wr.WriteEndAttribute();

            wr.WriteStartAttribute("version");
            wr.WriteString("1.1.0");
            wr.WriteEndAttribute();

            wr.WriteStartElement("infoTributaria");

            wr.WriteStartElement("ambiente");
            wr.WriteString(infoTributaria.Rows[0]["ambiente"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("tipoEmision");
            wr.WriteString(infoTributaria.Rows[0]["tipoEmision"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("razonSocial");
            wr.WriteString(infoTributaria.Rows[0]["razonSocial"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("nombreComercial");
            wr.WriteString(infoTributaria.Rows[0]["nombreComercial"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("ruc");
            wr.WriteString(infoTributaria.Rows[0]["ruc"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("claveAcceso");
            wr.WriteString(infoTributaria.Rows[0]["claveAcceso"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("codDoc");
            wr.WriteString(infoTributaria.Rows[0]["codDoc"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("estab");
            wr.WriteString(infoTributaria.Rows[0]["estab"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("ptoEmi");
            wr.WriteString(infoTributaria.Rows[0]["ptoEmi"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("secuencial");
            wr.WriteString(infoTributaria.Rows[0]["secuencial"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("dirMatriz");
            wr.WriteString(infoTributaria.Rows[0]["dirMatriz"].ToString());
            wr.WriteEndElement();

            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["agenteRetencion"].ToString()))
            {
                wr.WriteStartElement("agenteRetencion");
                wr.WriteString("1");
                wr.WriteEndElement();
            }

            if (!string.IsNullOrEmpty(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString()))
            {
                wr.WriteStartElement("contribuyenteRimpe");
                wr.WriteString(infoTributaria.Rows[0]["contribuyenteRimpe"].ToString());
                wr.WriteEndElement();
            }

            wr.WriteEndElement(); //End <infoTributaria>

            wr.WriteStartElement("infoGuiaRemision");

            wr.WriteStartElement("dirEstablecimiento");
            wr.WriteString(infoGuiaRemision.Rows[0]["dirEstablecimiento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("dirPartida");
            wr.WriteString(infoGuiaRemision.Rows[0]["dirPartida"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("razonSocialTransportista");
            wr.WriteString(infoGuiaRemision.Rows[0]["razonSocialTransportista"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("tipoIdentificacionTransportista");
            wr.WriteString(infoGuiaRemision.Rows[0]["tipoIdentificacionTransportista"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("rucTransportista");
            wr.WriteString(infoGuiaRemision.Rows[0]["rucTransportista"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("obligadoContabilidad");
            wr.WriteString(infoGuiaRemision.Rows[0]["obligadoContabilidad"].ToString());
            wr.WriteEndElement();

            if (infoGuiaRemision.Rows[0]["contribuyenteEspecial"].ToString() != "0")
            {
                wr.WriteStartElement("contribuyenteEspecial");
                wr.WriteString(infoGuiaRemision.Rows[0]["contribuyenteEspecial"].ToString());
                wr.WriteEndElement();
            }

            wr.WriteStartElement("fechaIniTransporte");
            wr.WriteString(infoGuiaRemision.Rows[0]["fechaIniTransporte"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("fechaFinTransporte");
            wr.WriteString(infoGuiaRemision.Rows[0]["fechaFinTransporte"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("placa");
            wr.WriteString(infoGuiaRemision.Rows[0]["placa"].ToString());
            wr.WriteEndElement();

            wr.WriteEndElement(); //End <infoGuiaRemision>

            wr.WriteStartElement("destinatarios");

            wr.WriteStartElement("destinatario");

            wr.WriteStartElement("identificacionDestinatario");
            wr.WriteString(destinatario.Rows[0]["identificacionDestinatario"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("razonSocialDestinatario");
            wr.WriteString(destinatario.Rows[0]["razonSocialDestinatario"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("dirDestinatario");
            wr.WriteString(destinatario.Rows[0]["dirDestinatario"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("motivoTraslado");
            wr.WriteString(destinatario.Rows[0]["motivoTraslado"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("docAduaneroUnico");
            wr.WriteString(destinatario.Rows[0]["docAduaneroUnico"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("codEstabDestino");
            wr.WriteString(destinatario.Rows[0]["codEstabDestino"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("ruta");
            wr.WriteString(destinatario.Rows[0]["ruta"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("codDocSustento");
            wr.WriteString(destinatario.Rows[0]["codDocSustento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("numDocSustento");
            wr.WriteString(destinatario.Rows[0]["numDocSustento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("numAutDocSustento");
            wr.WriteString(destinatario.Rows[0]["numAutDocSustento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("fechaEmisionDocSustento");
            wr.WriteString(destinatario.Rows[0]["fechaEmisionDocSustento"].ToString());
            wr.WriteEndElement();

            wr.WriteStartElement("detalles");
            GuiaRemisionDetalle(wr, detail);
            wr.WriteEndElement();


            wr.WriteEndElement(); //End <destinatario> 

            wr.WriteEndElement(); //End <destinatarios>

            if (infoAdicional.Rows.Count > 0)
            {
                wr.WriteStartElement("infoAdicional");

                NodoInfoAdicional(wr, infoAdicional); //READ METHOD

                wr.WriteEndElement();
            }

            wr.WriteEndElement(); //End <guiaRemision>

            wr.WriteEndDocument();

            wr.Close();

            xml = Encoding.UTF8.GetString(stream.ToArray());

            return xml;
        }
        public void GuiaRemisionDetalle(XmlTextWriter wr, DataTable detail)
        {
            foreach (DataRow item in detail.Rows)
            {
                wr.WriteStartElement("detalle");

                wr.WriteStartElement("codigoInterno");
                wr.WriteString(item["codigoInterno"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("codigoAdicional");
                wr.WriteString(item["codigoAdicional"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("descripcion");
                wr.WriteString(item["descripcion"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("cantidad");
                wr.WriteString(item["cantidad"].ToString());
                wr.WriteEndElement();

                wr.WriteEndElement();
            }
        }
        public string XmlRetencionV1(DataSet ds)
        {
            MemoryStream stream = new MemoryStream();
            TextWriter DocumentText = new StreamWriter(stream);
            XmlTextWriter wr = new XmlTextWriter(DocumentText);
            DataTable infoTributaria = ds.Tables[0];
            DataTable infoCompRetencion = ds.Tables[1];
            DataTable impuestos = ds.Tables[2];
            DataTable infoAdicional = ds.Tables[3];


            wr.WriteStartDocument(true);
            wr.Formatting = System.Xml.Formatting.Indented;
            wr.Indentation = 2;

            wr.WriteStartElement("comprobanteRetencion");

            wr.WriteStartAttribute("id");
            wr.WriteString("comprobante");
            wr.WriteEndAttribute();

            wr.WriteStartAttribute("version");
            wr.WriteString("1.0.0");
            wr.WriteEndAttribute();

            wr.WriteStartElement("infoTributaria");

            //1 max1 num-\\
            wr.WriteStartElement("ambiente");
            wr.WriteString(infoTributaria.Rows[0]["ambiente"].ToString());
            wr.WriteEndElement();

            //1 max1 num--\\
            wr.WriteStartElement("tipoEmision");
            wr.WriteString(infoTributaria.Rows[0]["tipoEmision"].ToString());
            wr.WriteEndElement();

            //max 300 alfanum\\
            wr.WriteStartElement("razonSocial");
            wr.WriteString(infoTributaria.Rows[0]["razonSocial"].ToString());
            wr.WriteEndElement();

            //max 300 alfanum\\
            wr.WriteStartElement("nombreComercial");
            wr.WriteString(infoTributaria.Rows[0]["nombreComercial"].ToString());
            wr.WriteEndElement();

            //max 13 num\\
            wr.WriteStartElement("ruc");
            wr.WriteString(infoTributaria.Rows[0]["ruc"].ToString());
            wr.WriteEndElement();

            //max 49 num-\\
            wr.WriteStartElement("claveAcceso");
            wr.WriteString(infoTributaria.Rows[0]["claveAcceso"].ToString());
            wr.WriteEndElement();

            //......(1 factura etc) num max 2\\
            wr.WriteStartElement("codDoc");
            wr.WriteString(infoTributaria.Rows[0]["codDoc"].ToString());
            wr.WriteEndElement();

            //-num max 3\\
            wr.WriteStartElement("estab");
            wr.WriteString(infoTributaria.Rows[0]["estab"].ToString());
            wr.WriteEndElement();

            //num max 3--\\
            wr.WriteStartElement("ptoEmi");
            wr.WriteString(infoTributaria.Rows[0]["ptoEmi"].ToString());
            wr.WriteEndElement();

            //num max 9 --secuencia de la retencion\\
            wr.WriteStartElement("secuencial");
            wr.WriteString(infoTributaria.Rows[0]["secuencial"].ToString());
            wr.WriteEndElement();

            //alfanum max 300-\\
            wr.WriteStartElement("dirMatriz");
            wr.WriteString(infoTributaria.Rows[0]["dirMatriz"].ToString());
            wr.WriteEndElement();

            //------Normativa del sri------\\
           

            wr.WriteEndElement();

            wr.WriteStartElement("infoCompRetencion");

            //fecha dd/MM/aaaa\\
            wr.WriteStartElement("fechaEmision");
            wr.WriteString(infoCompRetencion.Rows[0]["fechaEmision"].ToString());
            wr.WriteEndElement();

            //alfanum max 300--\\
            wr.WriteStartElement("dirEstablecimiento");
            wr.WriteString(infoCompRetencion.Rows[0]["dirEstablecimiento"].ToString());
            wr.WriteEndElement();

            //Alfanum max 13-\\
            if (!string.IsNullOrEmpty(infoCompRetencion.Rows[0]["contribuyenteEspecial"].ToString().Trim()))
            {
                wr.WriteStartElement("contribuyenteEspecial");
                wr.WriteString(infoCompRetencion.Rows[0]["contribuyenteEspecial"].ToString());
                wr.WriteEndElement();
            }

            //SI || NO texto-\\
            wr.WriteStartElement("obligadoContabilidad");
            wr.WriteString(infoCompRetencion.Rows[0]["obligadoContabilidad"].ToString());
            wr.WriteEndElement();

            //-num max 2--\\
            wr.WriteStartElement("tipoIdentificacionSujetoRetenido");
            wr.WriteString(infoCompRetencion.Rows[0]["tipoIdentificacionSujetoRetenido"].ToString());
            wr.WriteEndElement();

            //-alfa num max 300--\\
            wr.WriteStartElement("razonSocialSujetoRetenido");
            wr.WriteString(infoCompRetencion.Rows[0]["razonSocialSujetoRetenido"].ToString());
            wr.WriteEndElement();

            //-alfanum max 20-\\
            wr.WriteStartElement("identificacionSujetoRetenido");
            wr.WriteString(infoCompRetencion.Rows[0]["identificacionSujetoRetenido"].ToString());
            wr.WriteEndElement();

            //Fecha mm/aaaa\\
            wr.WriteStartElement("periodoFiscal");
            wr.WriteString(infoCompRetencion.Rows[0]["periodoFiscal"].ToString());
            wr.WriteEndElement();

            wr.WriteEndElement();

            //GENERAMOS DETALLE DE LA RETENCION

            wr.WriteStartElement("impuestos");

            RetencionImpuestos(wr, impuestos);

            wr.WriteEndElement();

            if (infoAdicional.Rows.Count > 0)
            {
                wr.WriteStartElement("infoAdicional");

                NodoInfoAdicional(wr, ds.Tables[3]); //READ METHOD

                wr.WriteEndElement();
            }
            wr.WriteEndElement();

            wr.WriteEndDocument();
            wr.Close();
            return Encoding.UTF8.GetString(stream.ToArray());
        }
        public void RetencionImpuestos(XmlTextWriter wr, DataTable dt)
        {
            foreach (DataRow item in dt.Rows)
            {
                wr.WriteStartElement("impuesto");

                wr.WriteStartElement("codigo");
                wr.WriteString(item["codigo"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("codigoRetencion");
                wr.WriteString(item["codigoRetencion"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("baseImponible");
                wr.WriteString(item["baseImponible"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("porcentajeRetener");
                wr.WriteString(item["porcentajeRetener"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("valorRetenido");
                wr.WriteString(item["valorRetenido"].ToString());
                wr.WriteEndElement();
                wr.WriteStartElement("codDocSustento");
                wr.WriteString(item["codDocSustento"].ToString()); //1 si es factura 3 si es liquidacion
                wr.WriteEndElement();

                wr.WriteStartElement("numDocSustento");
                wr.WriteString(item["numDocSustento"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("fechaEmisionDocSustento");
                wr.WriteString(item["fechaEmisionDocSustento"].ToString());
                wr.WriteEndElement();
                wr.WriteEndElement();
            }
        }

        public string XmlRetencion(DataSet ds)
        {
            MemoryStream stream = new MemoryStream();
            TextWriter DocumentText = new StreamWriter(stream);
            XmlTextWriter wr = new XmlTextWriter(DocumentText);

            DataTable headerDoc = ds.Tables[0];
            DataTable infoAdicional = ds.Tables[7];

            wr.WriteStartDocument(true);
            wr.Formatting = Formatting.Indented;
            wr.Indentation = 2;

            wr.WriteStartElement("comprobanteRetencion");

            wr.WriteStartAttribute("id");
            wr.WriteString("comprobante");
            wr.WriteEndAttribute();

            wr.WriteStartAttribute("version");
            wr.WriteString("2.0.0");
            wr.WriteEndAttribute();

            wr.WriteStartElement("infoTributaria");

            //1 max1 num-\\
            wr.WriteStartElement("ambiente");
            wr.WriteString(headerDoc.Rows[0]["ambiente"].ToString());
            wr.WriteEndElement();

            //1 max1 num--\\
            wr.WriteStartElement("tipoEmision");
            wr.WriteString(headerDoc.Rows[0]["tipoEmision"].ToString());
            wr.WriteEndElement();

            //max 300 alfanum\\
            wr.WriteStartElement("razonSocial");
            wr.WriteString(headerDoc.Rows[0]["razonSocial"].ToString());
            wr.WriteEndElement();

            //max 300 alfanum\\
            if (!string.IsNullOrEmpty(headerDoc.Rows[0]["nombreComercial"].ToString().Trim()))
            {
                wr.WriteStartElement("nombreComercial");
                wr.WriteString(headerDoc.Rows[0]["nombreComercial"].ToString());
                wr.WriteEndElement();
            }

            //max 13 num\\
            wr.WriteStartElement("ruc");
            wr.WriteString(headerDoc.Rows[0]["ruc"].ToString());
            wr.WriteEndElement();

            //max 49 num-\\
            wr.WriteStartElement("claveAcceso");
            wr.WriteString(headerDoc.Rows[0]["claveAcceso"].ToString());
            wr.WriteEndElement();

            //......(1 factura etc) num max 2\\
            wr.WriteStartElement("codDoc");
            wr.WriteString(headerDoc.Rows[0]["codDoc"].ToString());
            wr.WriteEndElement();

            //-num max 3\\
            wr.WriteStartElement("estab");
            wr.WriteString(headerDoc.Rows[0]["estab"].ToString());
            wr.WriteEndElement();

            //num max 3--\\
            wr.WriteStartElement("ptoEmi");
            wr.WriteString(headerDoc.Rows[0]["ptoEmi"].ToString());
            wr.WriteEndElement();

            //num max 9 --secuencia de la retencion\\
            wr.WriteStartElement("secuencial");
            wr.WriteString(headerDoc.Rows[0]["secuencial"].ToString());
            wr.WriteEndElement();

            //alfanum max 300-\\
            wr.WriteStartElement("dirMatriz");
            wr.WriteString(headerDoc.Rows[0]["dirMatriz"].ToString());
            wr.WriteEndElement();

            //------Normativa del sri------\\
            if (!string.IsNullOrEmpty(headerDoc.Rows[0]["agenteRetencion"].ToString()))
            {
                wr.WriteStartElement("agenteRetencion");
                wr.WriteString("1");
                wr.WriteEndElement();
            }

            if (!string.IsNullOrEmpty(headerDoc.Rows[0]["contribuyenteRimpe"].ToString()))
            {
                wr.WriteStartElement("contribuyenteRimpe");
                wr.WriteString(headerDoc.Rows[0]["contribuyenteRimpe"].ToString());
                wr.WriteEndElement();
            }

            wr.WriteEndElement();

            wr.WriteStartElement("infoCompRetencion");

            //fecha dd/MM/aaaa\\
            wr.WriteStartElement("fechaEmision");
            wr.WriteString(headerDoc.Rows[0]["fechaEmision"].ToString());
            wr.WriteEndElement();

            //alfanum max 300--\\

            if (!string.IsNullOrEmpty(headerDoc.Rows[0]["dirEstablecimiento"].ToString().Trim()))
            {
                wr.WriteStartElement("dirEstablecimiento");
                wr.WriteString(headerDoc.Rows[0]["dirEstablecimiento"].ToString());
                wr.WriteEndElement();
            }

            //Alfanum max 13-\\
            if (!string.IsNullOrEmpty(headerDoc.Rows[0]["contribuyenteEspecial"].ToString().Trim()))
            {
                wr.WriteStartElement("contribuyenteEspecial");
                wr.WriteString(headerDoc.Rows[0]["contribuyenteEspecial"].ToString());
                wr.WriteEndElement();
            }

            //SI || NO texto-\\
            if (!string.IsNullOrEmpty(headerDoc.Rows[0]["obligadoContabilidad"].ToString().Trim()))
            {
                wr.WriteStartElement("obligadoContabilidad");
                wr.WriteString(headerDoc.Rows[0]["obligadoContabilidad"].ToString());
                wr.WriteEndElement();
            }

            //-num max 2--\\
            wr.WriteStartElement("tipoIdentificacionSujetoRetenido");
            wr.WriteString(headerDoc.Rows[0]["tipoIdentificacionSujetoRetenido"].ToString());
            wr.WriteEndElement();

            //-num max 2--\\
            if (!string.IsNullOrEmpty(headerDoc.Rows[0]["tipoSujetoRetenido"].ToString().Trim()))
            {
                wr.WriteStartElement("tipoSujetoRetenido");
                wr.WriteString(headerDoc.Rows[0]["tipoSujetoRetenido"].ToString());
                wr.WriteEndElement();
            }

            //-string max 2--\\
            wr.WriteStartElement("parteRel");
            wr.WriteString(headerDoc.Rows[0]["parteRel"].ToString());
            wr.WriteEndElement();

            //-alfa num max 300--\\
            wr.WriteStartElement("razonSocialSujetoRetenido");
            wr.WriteString(headerDoc.Rows[0]["razonSocialSujetoRetenido"].ToString());
            wr.WriteEndElement();

            //-alfanum max 20-\\
            wr.WriteStartElement("identificacionSujetoRetenido");
            wr.WriteString(headerDoc.Rows[0]["identificacionSujetoRetenido"].ToString());
            wr.WriteEndElement();

            //Fecha mm/aaaa\\
            wr.WriteStartElement("periodoFiscal");
            wr.WriteString(headerDoc.Rows[0]["periodoFiscal"].ToString());
            wr.WriteEndElement();

            wr.WriteEndElement();

            //Documentos de Sustento

            wr.WriteStartElement("docsSustento");

            NodoDocSustento(wr, ds);

            wr.WriteEndElement();


            if (infoAdicional.Rows.Count > 0)
            {
                wr.WriteStartElement("infoAdicional");

                NodoInfoAdicional(wr, infoAdicional); //READ METHOD

                wr.WriteEndElement();
            }

            wr.WriteEndElement();

            wr.WriteEndDocument();
            wr.Close();
            string xml = Encoding.UTF8.GetString(stream.ToArray());
            return xml;
        }

        // NODOS 
        public void NodoDocSustento(XmlTextWriter wr, DataSet ds)
        {

            DataTable docsSustento = ds.Tables[1];
            DataTable impuestosDocSustento = ds.Tables[2];
            DataTable retenciones = ds.Tables[3];
            DataTable reembolsos = ds.Tables[4];
            DataTable detalleImpuestos = ds.Tables[5];
            DataTable pagos = ds.Tables[6];

            bool hasDividendos = false;

            foreach (DataRow item in docsSustento.Rows)
            {
                wr.WriteStartElement("docSustento");

                wr.WriteStartElement("codSustento");
                wr.WriteString(item["codSustento"].ToString());
                wr.WriteEndElement();

                if (item["codSustento"].ToString() == "10")
                {
                    hasDividendos = true;
                }

                wr.WriteStartElement("codDocSustento");
                wr.WriteString(item["codDocSustento"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("numDocSustento");
                wr.WriteString(item["numDocSustento"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("fechaEmisionDocSustento");
                wr.WriteString(item["fechaEmisionDocSustento"].ToString());
                wr.WriteEndElement();

                if (!string.IsNullOrEmpty(item["fechaRegistroContable"].ToString().Trim()))
                {
                    wr.WriteStartElement("fechaRegistroContable");
                    wr.WriteString(item["fechaRegistroContable"].ToString());
                    wr.WriteEndElement();
                }
                if (!string.IsNullOrEmpty(item["numAutDocSustento"].ToString().Trim()))
                {
                    wr.WriteStartElement("numAutDocSustento");
                    wr.WriteString(item["numAutDocSustento"].ToString());
                    wr.WriteEndElement();
                }

                wr.WriteStartElement("pagoLocExt");
                wr.WriteString(item["pagoLocExt"].ToString());
                wr.WriteEndElement();

                if (item["pagoLocExt"].ToString() == "02")
                {
                    if (!string.IsNullOrEmpty(item["tipoRegi"].ToString().Trim()))
                    {
                        wr.WriteStartElement("tipoRegi");
                        wr.WriteString(item["tipoRegi"].ToString());
                        wr.WriteEndElement();
                    }


                    if (!string.IsNullOrEmpty(item["paisEfecPago"].ToString().Trim()))
                    {
                        wr.WriteStartElement("paisEfecPago");
                        wr.WriteString(item["paisEfecPago"].ToString());
                        wr.WriteEndElement();
                    }

                    if (!string.IsNullOrEmpty(item["aplicConvDobTrib"].ToString().Trim()))
                    {
                        wr.WriteStartElement("aplicConvDobTrib");
                        wr.WriteString(item["aplicConvDobTrib"].ToString());
                        wr.WriteEndElement();
                    }

                    if (!string.IsNullOrEmpty(item["pagExtSujRetNorLeg"].ToString().Trim()))
                    {
                        if (item["aplicConvDobTrib"].ToString().Trim() == "NO")
                        {
                            wr.WriteStartElement("pagExtSujRetNorLeg");
                            wr.WriteString(item["pagExtSujRetNorLeg"].ToString());
                            wr.WriteEndElement();
                        }
                    }
                }

                if (!string.IsNullOrEmpty(item["pagoRegFis"].ToString().Trim()))
                {
                    wr.WriteStartElement("pagoRegFis");
                    wr.WriteString(item["pagoRegFis"].ToString());
                    wr.WriteEndElement();
                }


                if (item["codDocSustento"].ToString() == "41")
                {
                    wr.WriteStartElement("totalComprobantesReembolso");
                    wr.WriteString(item["totalComprobantesReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("totalBaseImponibleReembolso");
                    wr.WriteString(item["totalBaseImponibleReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("totalImpuestoReembolso");
                    wr.WriteString(item["totalImpuestoReembolso"].ToString());
                    wr.WriteEndElement();
                }

                wr.WriteStartElement("totalSinImpuestos");
                wr.WriteString(item["totalSinImpuestos"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("importeTotal");
                wr.WriteString(item["importeTotal"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("impuestosDocSustento");
                NodoImpuestosDocSustento(wr, item["idRetAtsDocSustento"].ToString(), impuestosDocSustento);
                wr.WriteEndElement();

                wr.WriteStartElement("retenciones");
                NodoRetenciones(wr, item["idRetAtsDocSustento"].ToString(), retenciones, hasDividendos);
                wr.WriteEndElement();

                if (item["codDocSustento"].ToString() == "41")
                {
                    wr.WriteStartElement("reembolsos");
                    NodoReembolsos(wr, item["idRetAtsDocSustento"].ToString(), reembolsos, detalleImpuestos);
                    wr.WriteEndElement();
                }

                wr.WriteStartElement("pagos");
                NodoPagosRet(wr, item["idRetAtsDocSustento"].ToString(), pagos);
                wr.WriteEndElement();

                wr.WriteEndElement();
            }

        }
        public void NodoImpuestosDocSustento(XmlTextWriter wr, string idDocSust, DataTable impuestosDocSustento)
        {

            foreach (DataRow item in impuestosDocSustento.Rows)
            {
                if (idDocSust == item["idRetAtsDocSustento"].ToString())
                {
                    wr.WriteStartElement("impuestoDocSustento");

                    wr.WriteStartElement("codImpuestoDocSustento");
                    wr.WriteString(item["codImpuestoDocSustento"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("codigoPorcentaje");
                    wr.WriteString(item["codigoPorcentaje"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("baseImponible");
                    wr.WriteString(item["baseImponible"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("tarifa");
                    wr.WriteString(item["tarifa"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("valorImpuesto");
                    wr.WriteString(item["valorImpuesto"].ToString());
                    wr.WriteEndElement();

                    wr.WriteEndElement();
                }
            }
        }
        public void NodoRetenciones(XmlTextWriter wr, string idDocSust, DataTable retenciones, bool hasDividendos)
        {
            foreach (DataRow item in retenciones.Rows)
            {
                if (idDocSust == item["idRetAtsDocSustento"].ToString())
                {
                    wr.WriteStartElement("retencion");

                    wr.WriteStartElement("codigo");
                    wr.WriteString(item["codigo"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("codigoRetencion");
                    wr.WriteString(item["codigoRetencion"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("baseImponible");
                    wr.WriteString(item["baseImponible"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("porcentajeRetener");
                    wr.WriteString(item["porcentajeRetener"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("valorRetenido");
                    wr.WriteString(item["valorRetenido"].ToString());
                    wr.WriteEndElement();

                    if (hasDividendos)
                    {
                        wr.WriteStartElement("dividendos");

                        wr.WriteStartElement("fechaPagoDiv");
                        wr.WriteString(item["fechaPagoDiv"].ToString());
                        wr.WriteEndElement();

                        wr.WriteStartElement("imRentaSoc");
                        wr.WriteString(item["imRentaSoc"].ToString());
                        wr.WriteEndElement();

                        wr.WriteStartElement("ejerFisUtDiv");
                        wr.WriteString(item["ejerFisUtDiv"].ToString());
                        wr.WriteEndElement();

                        wr.WriteEndElement();
                    }

                    if (Convert.ToBoolean(item["isBanana"]))
                    {
                        wr.WriteStartElement("compraCajBanano");

                        wr.WriteStartElement("numCajBan");
                        wr.WriteString(item["numCajBan"].ToString());
                        wr.WriteEndElement();

                        wr.WriteStartElement("precCajBan");
                        wr.WriteString(item["precCajBan"].ToString());
                        wr.WriteEndElement();

                        wr.WriteEndElement();
                    }

                    wr.WriteEndElement();
                }
            }
        }
        public void NodoReembolsos(XmlTextWriter wr, string idDocSust, DataTable reembolsos, DataTable taxes)
        {
            foreach (DataRow item in reembolsos.Rows)
            {
                if (idDocSust == item["idRetAtsDocSustento"].ToString())
                {
                    wr.WriteStartElement("reembolsoDetalle");

                    wr.WriteStartElement("tipoIdentificacionProveedorReembolso");
                    wr.WriteString(item["tipoIdentificacionProveedorReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("identificacionProveedorReembolso");
                    wr.WriteString(item["identificacionProveedorReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("codPaisPagoProveedorReembolso");
                    wr.WriteString(item["codPaisPagoProveedorReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("tipoProveedorReembolso");
                    wr.WriteString(item["tipoProveedorReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("codDocReembolso");
                    wr.WriteString(item["codDocReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("estabDocReembolso");
                    wr.WriteString(item["estabDocReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("ptoEmiDocReembolso");
                    wr.WriteString(item["ptoEmiDocReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("secuencialDocReembolso");
                    wr.WriteString(item["secuencialDocReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("fechaEmisionDocReembolso");
                    wr.WriteString(item["fechaEmisionDocReembolso"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("numeroAutorizacionDocReemb");
                    wr.WriteString(item["numeroAutorizacionDocReemb"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("detalleImpuestos");
                    foreach (DataRow tax in taxes.Rows)
                    {
                        if (item["numeroAutorizacionDocReemb"].ToString() == tax["numeroAutorizacionDocReemb"].ToString())
                        {
                            wr.WriteStartElement("detalleImpuesto");

                            wr.WriteStartElement("codigo");
                            wr.WriteString(tax["codigo"].ToString());
                            wr.WriteEndElement();

                            wr.WriteStartElement("codigoPorcentaje");
                            wr.WriteString(tax["codigoPorcentaje"].ToString());
                            wr.WriteEndElement();

                            wr.WriteStartElement("tarifa");
                            wr.WriteString(tax["tarifa"].ToString());
                            wr.WriteEndElement();

                            wr.WriteStartElement("baseImponibleReembolso");
                            wr.WriteString(tax["baseImponibleReembolso"].ToString());
                            wr.WriteEndElement();

                            wr.WriteStartElement("impuestoReembolso");
                            wr.WriteString(tax["impuestoReembolso"].ToString());
                            wr.WriteEndElement();

                            wr.WriteEndElement();
                        }
                    }
                    wr.WriteEndElement();

                    wr.WriteEndElement();
                }
            }
        }
        public void NodoPagosRet(XmlTextWriter wr, string idDocSust, DataTable payments)
        {

            foreach (DataRow item in payments.Rows)
            {
                if (idDocSust == item["idRetAtsDocSustento"].ToString())
                {
                    wr.WriteStartElement("pago");

                    wr.WriteStartElement("formaPago");
                    wr.WriteString(item["formaPago"].ToString());
                    wr.WriteEndElement();

                    wr.WriteStartElement("total");
                    wr.WriteString(item["total"].ToString());
                    wr.WriteEndElement();

                    wr.WriteEndElement();
                }
            }
        }
        public void NodoDetalle(XmlTextWriter wr, DataTable detail)
        {
            foreach (DataRow item in detail.Rows)
            {
                wr.WriteStartElement("detalle");

                wr.WriteStartElement("codigoPrincipal");//alfanum max 25  -- item
                wr.WriteString(item["codigoPrincipal"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("codigoAuxiliar");//alfanum max 25  --cuota
                wr.WriteString(item["codigoAuxiliar"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("descripcion");//alfa num max 300
                wr.WriteString(item["descripcion"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("cantidad"); // num max 14                
                wr.WriteString(item["cantidad"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("precioUnitario");// num max 14
                wr.WriteString(item["precioUnitario"].ToString().Replace(",", "."));
                wr.WriteEndElement();

                wr.WriteStartElement("descuento");// num max 14
                wr.WriteString(item["descuento"].ToString().Replace(",", "."));
                wr.WriteEndElement();

                wr.WriteStartElement("precioTotalSinImpuesto");//num max 14
                wr.WriteString(item["precioTotalSinImpuesto"].ToString().Replace(",", "."));
                wr.WriteEndElement();

                wr.WriteStartElement("impuestos");

                wr.WriteStartElement("impuesto");

                wr.WriteStartElement("codigo");
                wr.WriteString(item["codigo"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("codigoPorcentaje");
                wr.WriteString(item["codigoPorcentaje"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("tarifa");
                wr.WriteString(item["tarifa"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("baseImponible");
                wr.WriteString(item["baseImponible"].ToString().ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("valor");
                wr.WriteString(item["valor"].ToString());
                wr.WriteEndElement();

                wr.WriteEndElement(); //End <impuesto>

                wr.WriteEndElement(); //End <impuestos>

                wr.WriteEndElement();
            }
        }
        public void NodoPagos(XmlTextWriter wr, DataTable payments)
        {
            foreach (DataRow item in payments.Rows)
            {
                wr.WriteStartElement("pago");

                wr.WriteStartElement("formaPago");
                wr.WriteString(item["formaPago"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("total");
                wr.WriteString(item["total"].ToString());
                wr.WriteEndElement();

                if (item.Table.Columns.Contains("plazo"))
                {
                    if (!string.IsNullOrEmpty(item["plazo"].ToString()))
                    {
                        wr.WriteStartElement("plazo");
                        wr.WriteString(item["plazo"].ToString());
                        wr.WriteEndElement();
                    }
                }
                if (item.Table.Columns.Contains("unidadTiempo"))
                {
                    if (!string.IsNullOrEmpty(item["unidadTiempo"].ToString()))
                    {
                        wr.WriteStartElement("unidadTiempo");
                        wr.WriteString(item["unidadTiempo"].ToString());
                        wr.WriteEndElement();
                    }
                }

                wr.WriteEndElement();
            }
        }
        public void NodoImpuestos(XmlTextWriter wr, DataTable taxes)
        {
            foreach (DataRow item in taxes.Rows)
            {
                wr.WriteStartElement("totalImpuesto");

                wr.WriteStartElement("codigo");
                wr.WriteString(item["codigo"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("codigoPorcentaje");
                wr.WriteString(item["codigoPorcentaje"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("baseImponible");
                wr.WriteString(item["baseImponible"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("valor");
                wr.WriteString(item["valor"].ToString());
                wr.WriteEndElement(); //Cierra totalImpuesto
                wr.WriteEndElement(); //Cierra totalConImpuesto
            }
        }
        public void NodoInfoAdicional(XmlTextWriter wr, DataTable infoAdicional)
        {
            
            foreach (DataRow item in infoAdicional.Rows)
            {
                wr.WriteStartElement("campoAdicional");
                wr.WriteStartAttribute("nombre");
                wr.WriteString(item["nombre"].ToString());
                wr.WriteEndAttribute();
                wr.WriteString(item["valor"].ToString());
                wr.WriteEndElement();
            }
            
        }
        public void XmlLote(DataSet ds, ref bool _response)
        {
            try
            {
                MemoryStream stream = new MemoryStream();
                TextWriter DocumentText = new StreamWriter(stream);
                XmlTextWriter wr = new XmlTextWriter(DocumentText);

                wr.WriteStartDocument(true);
                wr.Formatting = System.Xml.Formatting.Indented;
                wr.Indentation = 2;

                wr.WriteStartElement("lote");

                wr.WriteStartAttribute("version");
                wr.WriteString("1.0.0");
                wr.WriteEndAttribute();

                wr.WriteStartElement("claveAcceso");
                wr.WriteString(ds.Tables[0].Rows[0]["claveAcceso"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("ruc");
                wr.WriteString(ds.Tables[0].Rows[0]["ruc"].ToString());
                wr.WriteEndElement();

                wr.WriteStartElement("comprobantes");

                DataSet document = new DataSet();

                foreach (DataRow item in ds.Tables[0].Rows)
                {
                    //string codDoc = item["codDoc"].ToString();
                    //long idDocumento = Convert.ToInt64(item["idDocumento"]);
                    //document = await new DocumentoElectronicoDao().GetAuthorize(idRol, codDoc, idDocumento);
                    //if (codDoc == "01")
                    //{
                    //    _response = await new XmlFactura().WriteXmlTestAsync(document, false);
                    //}
                    //if (_response.estado == "FIRMADO")
                    //{
                    //if (_response.xml != null)
                    wr.WriteStartElement("comprobante");
                    string comprobante = item["xmlAcontPlus"].ToString();
                    //XCData cData = new XCData(comprobante);
                    //wr.WriteString(cData.ToString());
                    wr.WriteCData(comprobante);
                    wr.WriteEndElement();
                    //}
                }

                wr.WriteEndElement();
                wr.WriteEndElement();

                wr.WriteEndDocument();

                wr.Close(); 
            }
            catch (System.Exception ex)
            {
                _ = ex.Message;
                _response = false;
            }
        }

    }
}
