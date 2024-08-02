namespace FactElect.Application.Services;

public class AtsXml
{
    public bool Create(ref DataSet ds, ref byte[] xmlSales)
    {
        var dtHeader = ds.Tables[0];
        var dtShopping = ds.Tables[1];
        var dtSales = ds.Tables[2];
        var dtCanceled = ds.Tables[3];
        var dtRetenciones = ds.Tables[4];
        var dtVentasEstab = ds.Tables[5];

        var atsMS = new MemoryStream();
        TextWriter tw = new StreamWriter(atsMS);
        var xtr = new XmlTextWriter(tw);
        xtr.WriteStartDocument(true);
        xtr.Formatting = Formatting.Indented;
        xtr.Indentation = 2;

        xtr.WriteStartElement("iva");

        xtr.WriteStartElement("TipoIDInformante");
        xtr.WriteString(dtHeader.Rows[0]["TipoIdInformante"].ToString());
        xtr.WriteEndElement();

        xtr.WriteStartElement("IdInformante");
        xtr.WriteString(dtHeader.Rows[0]["IdInformante"].ToString());
        xtr.WriteEndElement();

        xtr.WriteStartElement("razonSocial");
        xtr.WriteString(dtHeader.Rows[0]["razonSocial"].ToString());
        xtr.WriteEndElement();

        xtr.WriteStartElement("Anio");
        xtr.WriteString(dtHeader.Rows[0]["anio"].ToString());
        xtr.WriteEndElement();

        xtr.WriteStartElement("Mes");
        xtr.WriteString(dtHeader.Rows[0]["mes"].ToString());
        xtr.WriteEndElement();

        xtr.WriteStartElement("numEstabRuc");
        xtr.WriteString(dtHeader.Rows[0]["numEstabRuc"].ToString());
        xtr.WriteEndElement();

        xtr.WriteStartElement("totalVentas");
        xtr.WriteString(dtHeader.Rows[0]["totalVentas"].ToString());
        xtr.WriteEndElement();

        xtr.WriteStartElement("codigoOperativo");
        xtr.WriteString(dtHeader.Rows[0]["codigoOperativo"].ToString());
        xtr.WriteEndElement();

        //Compras
        if (dtShopping.Rows.Count > 0 && dtShopping.Columns.Contains("codSustento"))
        {
            NodeShopping(xtr, dtShopping, dtRetenciones);
        }

        //Ventas
        if (dtSales.Rows.Count > 0)
        {
            NodeSales(xtr, dtSales);

            NodeVentasEstab(xtr, dtVentasEstab);

            //xtr.WriteStartElement("ventasEstablecimiento"); //start ventasEstablecimiento

            //xtr.WriteStartElement("ventaEst"); //start ventaEst

            //xtr.WriteStartElement("codEstab");
            //xtr.WriteString(dtHeader.Rows[0]["codEstab"].ToString());
            //xtr.WriteEndElement();

            //xtr.WriteStartElement("ventasEstab");
            //xtr.WriteString(dtHeader.Rows[0]["totalVentas"].ToString());
            //xtr.WriteEndElement();

            //xtr.WriteStartElement("ivaComp");
            //xtr.WriteString(dtHeader.Rows[0]["ivaComp"].ToString());
            //xtr.WriteEndElement();

            //xtr.WriteEndElement(); //end ventaEst

            //xtr.WriteEndElement(); //end ventasEstablecimiento
        }

        //Anulados
        if (dtCanceled.Rows.Count > 0)
        {
            NodeCanceledDocs(xtr, dtCanceled);
        }

        xtr.WriteEndElement();
        xtr.WriteEndDocument();
        xtr.Close();

        xmlSales = atsMS.ToArray();
        xtr.Close();
        atsMS.Close();
        return true;
    }

    public void NodeShopping(XmlTextWriter xtr, DataTable dt, DataTable dtRetenciones)
    {
        xtr.WriteStartElement("compras"); //start compras

        foreach (DataRow dr in dt.Rows)
        {
            xtr.WriteStartElement("detalleCompras"); //start detalleCompras

            xtr.WriteStartElement("codSustento");
            xtr.WriteString(dr["codSustento"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("tpIdProv");
            xtr.WriteString(dr["tpIdProv"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("idProv");
            xtr.WriteString(dr["idProv"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("tipoComprobante");
            xtr.WriteString(dr["tipoComprobante"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("parteRel");
            xtr.WriteString(dr["parteRel"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("fechaRegistro");
            xtr.WriteString(dr["fechaRegistro"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("establecimiento");
            xtr.WriteString(dr["establecimiento"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("puntoEmision");
            xtr.WriteString(dr["puntoEmision"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("secuencial");
            xtr.WriteString(dr["secuencial"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("fechaEmision");
            xtr.WriteString(dr["fechaEmision"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("autorizacion");
            xtr.WriteString(dr["autorizacion"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("baseNoGraIva");
            xtr.WriteString(dr["baseNoGraIva"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("baseImponible");
            xtr.WriteString(dr["baseImponible"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("baseImpGrav");
            xtr.WriteString(dr["baseImpGrav"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("baseImpExe");
            xtr.WriteString(dr["baseImpExe"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("montoIce");
            xtr.WriteString(dr["montoIce"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("montoIva");
            xtr.WriteString(dr["montoIva"].ToString());
            xtr.WriteEndElement();

            //Retención IVA 10%
            xtr.WriteStartElement("valRetBien10");
            xtr.WriteString(dr["valRetBien10"].ToString());
            xtr.WriteEndElement();

            //Retención IVA 20%
            xtr.WriteStartElement("valRetServ20");
            xtr.WriteString(dr["valRetServ20"].ToString());
            xtr.WriteEndElement();

            //Retención IVA 30%
            xtr.WriteStartElement("valorRetBienes");
            xtr.WriteString(dr["valorRetBienes"].ToString());
            xtr.WriteEndElement();

            //Retención IVA 50%
            xtr.WriteStartElement("valRetServ50");
            xtr.WriteString(dr["valRetServ50"].ToString());
            xtr.WriteEndElement();

            //Retención IVA 70%
            xtr.WriteStartElement("valorRetServicios");
            xtr.WriteString(dr["valorRetServicios"].ToString());
            xtr.WriteEndElement();

            //Retención IVA 100%
            xtr.WriteStartElement("valRetServ100");
            xtr.WriteString(dr["valRetServ100"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("totbasesImpReemb");
            xtr.WriteString(dr["totbasesImpReemb"].ToString());
            xtr.WriteEndElement();

            //if (dt.Columns.Contains("pagoLocExt"))
            //{
            xtr.WriteStartElement("pagoExterior"); //start pagoExterior

            xtr.WriteStartElement("pagoLocExt");
            xtr.WriteString(dr["pagoLocExt"].ToString());
            xtr.WriteEndElement();

            if (dr["pagoLocExt"].ToString() == "02")
            {
                xtr.WriteStartElement("tipoRegi");
                xtr.WriteString(dr["tipoRegi"].ToString());
                xtr.WriteEndElement();
            }

            xtr.WriteStartElement("denopagoRegFis");
            xtr.WriteString(dr["denopagoRegFis"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("paisEfecPago");
            xtr.WriteString(dr["paisEfecPago"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("aplicConvDobTrib");
            xtr.WriteString(dr["aplicConvDobTrib"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("pagExtSujRetNorLeg");
            xtr.WriteString(dr["pagExtSujRetNorLeg"].ToString());
            xtr.WriteEndElement();
            xtr.WriteEndElement();
            //end pagoExterior
            //}


            if (!string.IsNullOrEmpty(dr["formaPago"].ToString()))
            {
                xtr.WriteStartElement("formasDePago"); //start formasDePago

                xtr.WriteStartElement("formaPago");
                xtr.WriteString(dr["formaPago"].ToString());
                xtr.WriteEndElement();

                xtr.WriteEndElement(); //end formasDePago
            }

            if (dtRetenciones.Select(string.Format("nroDocumento='{0}'", dr["nroDocumento"])).Count() > 0)
            {
                xtr.WriteStartElement("air"); //start air
                NodeRetenciones(xtr, dr["nroDocumento"].ToString(), dtRetenciones);
                xtr.WriteEndElement(); //end air
            }

            if (dr.Field<string>("tipoComprobante") == "04")
            {
                xtr.WriteStartElement("docModificado");
                xtr.WriteString(dr["docModificado"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("estabModificado");
                xtr.WriteString(dr["estabModificado"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("ptoEmiModificado");
                xtr.WriteString(dr["ptoEmiModificado"].ToString());
                xtr.WriteEndElement();


                xtr.WriteStartElement("secModificado");
                xtr.WriteString(dr["secModificado"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("autModificado");
                xtr.WriteString(dr["autModificado"].ToString());
                xtr.WriteEndElement();
            }


            if (!string.IsNullOrEmpty(dr["estabRetencion1"].ToString()))
            {
                xtr.WriteStartElement("estabRetencion1");
                xtr.WriteString(dr["estabRetencion1"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("ptoEmiRetencion1");
                xtr.WriteString(dr["ptoEmiRetencion1"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("secRetencion1");
                xtr.WriteString(dr["secRetencion1"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("autRetencion1");
                xtr.WriteString(dr["autRetencion1"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("fechaEmiRet1");
                xtr.WriteString(dr["fechaEmiRet1"].ToString());
                xtr.WriteEndElement();
            }


            xtr.WriteEndElement(); //end detalleCompras
        }

        xtr.WriteEndElement(); //end compras
    }

    public void NodeRetenciones(XmlTextWriter xtr, string nroDoc, DataTable dt)
    {
        foreach (DataRow dr in dt.Rows)
        {
            if (nroDoc == dr["nroDocumento"].ToString())
            {
                xtr.WriteStartElement("detalleAir"); //start detalleAir

                xtr.WriteStartElement("codRetAir");
                xtr.WriteString(dr["codRetAir"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("baseImpAir");
                xtr.WriteString(dr["baseImpAir"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("porcentajeAir");
                xtr.WriteString(dr["porcentajeAir"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("valRetAir");
                xtr.WriteString(dr["valRetAir"].ToString());
                xtr.WriteEndElement();

                xtr.WriteEndElement(); //end detalleAir
            }
        }
    }

    public void NodeSales(XmlTextWriter xtr, DataTable dt)
    {
        xtr.WriteStartElement("ventas"); //start ventas

        foreach (DataRow dr in dt.Rows)
        {
            xtr.WriteStartElement("detalleVentas"); //start detalleVentas

            xtr.WriteStartElement("tpIdCliente");
            xtr.WriteString(dr["tpIdCliente"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("idCliente");
            xtr.WriteString(dr["idCliente"].ToString());
            xtr.WriteEndElement();

            if (dr["tpIdCliente"].ToString() == "04" || dr["tpIdCliente"].ToString() == "05" ||
                dr["tpIdCliente"].ToString() == "06")
            {
                xtr.WriteStartElement("parteRelVtas");
                xtr.WriteString(dr["parteRelVtas"].ToString());
                xtr.WriteEndElement();
            }

            if (dr["tpIdCliente"].ToString() == "06")
            {
                xtr.WriteStartElement("tipoCliente");
                xtr.WriteString(dr["tipoCliente"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("denoCli");
                xtr.WriteString(dr["denoCli"].ToString());
                xtr.WriteEndElement();
            }

            xtr.WriteStartElement("tipoComprobante");
            xtr.WriteString(dr["tipoComprobante"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("tipoEmision");
            xtr.WriteString(dr["tipoEmision"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("numeroComprobantes");
            xtr.WriteString(dr["numeroComprobantes"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("baseNoGraIva");
            xtr.WriteString(dr["baseNoGraIva"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("baseImponible");
            xtr.WriteString(dr["baseImponible"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("baseImpGrav");
            xtr.WriteString(dr["baseImpGrav"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("montoIva");
            xtr.WriteString(dr["montoIva"].ToString());
            xtr.WriteEndElement();

            if (dt.Columns.Contains("tipoCompe"))
            {
                xtr.WriteStartElement("compensaciones"); //start compensaciones

                xtr.WriteStartElement("compensacion"); //start compesacion


                xtr.WriteStartElement("tipoCompe");
                xtr.WriteString(dr["tipoCompe"].ToString());
                xtr.WriteEndElement();

                xtr.WriteStartElement("monto");
                xtr.WriteString(dr["monto"].ToString());
                xtr.WriteEndElement();

                xtr.WriteEndElement(); //end compensacion

                xtr.WriteEndElement(); //end compensaciones
            }

            xtr.WriteStartElement("montoIce");
            xtr.WriteString(dr["montoIce"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("valorRetIva");
            xtr.WriteString(dr["valorRetIva"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("valorRetRenta");
            xtr.WriteString(dr["valorRetRenta"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("formasDePago"); //start formasDePago

            xtr.WriteStartElement("formaPago");
            xtr.WriteString(dr["formaPago"].ToString());
            xtr.WriteEndElement();

            xtr.WriteEndElement(); //end formasDePago

            xtr.WriteEndElement(); //end detalleVentas
        }

        xtr.WriteEndElement(); // end ventas
    }

    public void NodeVentasEstab(XmlTextWriter xtr, DataTable dt)
    {
        xtr.WriteStartElement("ventasEstablecimiento"); //start ventas
        foreach (DataRow dr in dt.Rows)
        {
            xtr.WriteStartElement("ventaEst"); //start ventas

            xtr.WriteStartElement("codEstab");
            xtr.WriteString(dr["codEstab"].ToString());
            xtr.WriteEndElement();


            xtr.WriteStartElement("ventasEstab");
            xtr.WriteString(dr["ventasEstab"].ToString());
            xtr.WriteEndElement();


            xtr.WriteStartElement("ivaComp");
            xtr.WriteString(dr["ivaComp"].ToString());
            xtr.WriteEndElement();

            xtr.WriteEndElement(); // end ventas
        }

        xtr.WriteEndElement(); // end ventas
    }

    public void NodeCanceledDocs(XmlTextWriter xtr, DataTable dt)
    {
        xtr.WriteStartElement("anulados"); //start anulados

        foreach (DataRow dr in dt.Rows)
        {
            xtr.WriteStartElement("detalleAnulados"); //start  detalleAnulados

            xtr.WriteStartElement("tipoComprobante");
            xtr.WriteString(dr["tipoComprobante"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("establecimiento");
            xtr.WriteString(dr["establecimiento"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("puntoEmision");
            xtr.WriteString(dr["puntoEmision"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("secuencialInicio");
            xtr.WriteString(dr["secuencialInicio"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("secuencialFin");
            xtr.WriteString(dr["secuencialFin"].ToString());
            xtr.WriteEndElement();

            xtr.WriteStartElement("autorizacion");
            xtr.WriteString(dr["autorizacion"].ToString());
            xtr.WriteEndElement();

            xtr.WriteEndElement(); //end detalleAnulados
        }

        xtr.WriteEndElement(); //end anulados
    }
}
