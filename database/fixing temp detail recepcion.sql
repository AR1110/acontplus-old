USE Acontplus
GO
--Recepcion.Doc_Detail_Temp_Get 117, 68100

--select * from Recepcion.Doc_Detalle_Temp where iddocumento = 68100
declare 
    @userRoleId INT = 117
    ,@idDocumento INT = 68100
    ,@jsonData VARCHAR(MAX) = '
	[
    {
        "idDetalle": 0,
        "codigoPrincipal": "ESLD001",
        "codigoAuxiliar": "E0001",
        "descripcion": "SLIDER UNIVERSAL MEDIA LUNA COLOR ",
        "cantidad": "52",
        "precioUnitario": "8.295999",
        "descuento": "0",
        "precioTotalSinImpuesto": "431.39",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"AMARILLO\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>431.39</baseImponible>\r\n\t\t<valor>64.7</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 1,
        "codigoPrincipal": "ESLD021",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER PULSAR  NS200 BIKER LINDA 2pzs.               ",
        "cantidad": "2",
        "precioUnitario": "35.217",
        "descuento": "0",
        "precioTotalSinImpuesto": "70.43",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>70.43</baseImponible>\r\n\t\t<valor>10.56</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 2,
        "codigoPrincipal": "ESLD014",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER PULSAR NS200 ORIGINAL  2pzs.",
        "cantidad": "10",
        "precioUnitario": "8.295999",
        "descuento": "0",
        "precioTotalSinImpuesto": "82.96",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>82.96</baseImponible>\r\n\t\t<valor>12.44</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 3,
        "codigoPrincipal": "ESLD024",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER  M1 DIAVOLO 250",
        "cantidad": "2",
        "precioUnitario": "35.217",
        "descuento": "0",
        "precioTotalSinImpuesto": "70.43",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>70.43</baseImponible>\r\n\t\t<valor>10.56</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 4,
        "codigoPrincipal": "ESLD025",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER PULSAR 160cc original 2pzs.",
        "cantidad": "5",
        "precioUnitario": "1.659",
        "descuento": "0",
        "precioTotalSinImpuesto": "8.29",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>8.28</baseImponible>\r\n\t\t<valor>1.24</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 5,
        "codigoPrincipal": "ESLD026",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER PULSAR 160cc 2pzs.",
        "cantidad": "5",
        "precioUnitario": "35.217",
        "descuento": "0",
        "precioTotalSinImpuesto": "176.08",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>176.08</baseImponible>\r\n\t\t<valor>26.41</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 6,
        "codigoPrincipal": "ESLD043",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER BENELLI 180 ROJO",
        "cantidad": "12",
        "precioUnitario": "8.295999",
        "descuento": "0",
        "precioTotalSinImpuesto": "99.55",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>99.55</baseImponible>\r\n\t\t<valor>14.93</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 7,
        "codigoPrincipal": "ESLD063",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER",
        "cantidad": "1",
        "precioUnitario": "35.217",
        "descuento": "0",
        "precioTotalSinImpuesto": "35.21",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\" SCRAMBLER 250 NEGRO\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>35.21</baseImponible>\r\n\t\t<valor>5.28</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 8,
        "codigoPrincipal": "ESLD065",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER GN 125 / 150 NEGRO",
        "cantidad": "2",
        "precioUnitario": "8.295999",
        "descuento": "0",
        "precioTotalSinImpuesto": "16.59",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>16.59</baseImponible>\r\n\t\t<valor>2.48</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 9,
        "codigoPrincipal": "ESLD072",
        "codigoAuxiliar": "SLD00048",
        "descripcion": "SLIDER TUKO CR5 250 LONCIN CR5 250 NEGRO",
        "cantidad": "15",
        "precioUnitario": "21.913",
        "descuento": "0",
        "precioTotalSinImpuesto": "328.69",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"2 TOPES\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>328.69</baseImponible>\r\n\t\t<valor>49.3</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 10,
        "codigoPrincipal": "EPAR011",
        "codigoAuxiliar": "",
        "descripcion": "PARRILLA SUZUKI AX4",
        "cantidad": "2",
        "precioUnitario": "21.13",
        "descuento": "0",
        "precioTotalSinImpuesto": "42.26",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>42.26</baseImponible>\r\n\t\t<valor>6.33</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 11,
        "codigoPrincipal": "EPAR025",
        "codigoAuxiliar": "",
        "descripcion": "PARRILLA PULSAR NS 200 SEMI LARGA",
        "cantidad": "2",
        "precioUnitario": "21.13",
        "descuento": "0",
        "precioTotalSinImpuesto": "42.26",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>42.26</baseImponible>\r\n\t\t<valor>6.33</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 12,
        "codigoPrincipal": "EPAR034",
        "codigoAuxiliar": "",
        "descripcion": "PARRILLA BENELLI 150 ",
        "cantidad": "2",
        "precioUnitario": "26.609",
        "descuento": "0",
        "precioTotalSinImpuesto": "53.21",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>53.21</baseImponible>\r\n\t\t<valor>7.98</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 13,
        "codigoPrincipal": "EPAR051",
        "codigoAuxiliar": "",
        "descripcion": "PARRILLA PRO 6",
        "cantidad": "2",
        "precioUnitario": "26.609",
        "descuento": "0",
        "precioTotalSinImpuesto": "53.21",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>53.21</baseImponible>\r\n\t\t<valor>7.98</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 14,
        "codigoPrincipal": "EPAR053",
        "codigoAuxiliar": "",
        "descripcion": "PARRILLA DOMINAR 400",
        "cantidad": "2",
        "precioUnitario": "26.609",
        "descuento": "0",
        "precioTotalSinImpuesto": "53.21",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>53.21</baseImponible>\r\n\t\t<valor>7.98</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 15,
        "codigoPrincipal": "EPAR065",
        "codigoAuxiliar": "",
        "descripcion": "PARRILA PULSAR 180 LARGA ",
        "cantidad": "2",
        "precioUnitario": "26.609",
        "descuento": "0",
        "precioTotalSinImpuesto": "53.21",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>53.21</baseImponible>\r\n\t\t<valor>7.98</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 16,
        "codigoPrincipal": "ETOPE009",
        "codigoAuxiliar": "",
        "descripcion": "TOPE   NEGRO PAR",
        "cantidad": "40",
        "precioUnitario": "0.078",
        "descuento": "0",
        "precioTotalSinImpuesto": "3.12",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"GRANDE\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>3.12</baseImponible>\r\n\t\t<valor>0.46</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 17,
        "codigoPrincipal": "EFORR010",
        "codigoAuxiliar": "",
        "descripcion": "FORRO ACIENTO PULSAR 135 NEGRO",
        "cantidad": "25",
        "precioUnitario": "3.252",
        "descuento": "0",
        "precioTotalSinImpuesto": "81.3",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>81.3</baseImponible>\r\n\t\t<valor>12.19</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 18,
        "codigoPrincipal": "EFORR011",
        "codigoAuxiliar": "",
        "descripcion": "FORRO ACIENTO UNIVERSAL 2 PIEZAS NEGRO",
        "cantidad": "30",
        "precioUnitario": "3.252",
        "descuento": "0",
        "precioTotalSinImpuesto": "97.56",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>97.56</baseImponible>\r\n\t\t<valor>14.63</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 19,
        "codigoPrincipal": "ESLD066",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER BAJAJ 100 PLATINO NEGRO",
        "cantidad": "2",
        "precioUnitario": "8.295999",
        "descuento": "0",
        "precioTotalSinImpuesto": "16.59",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>16.59</baseImponible>\r\n\t\t<valor>2.48</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 20,
        "codigoPrincipal": "ESLD027",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER UNIVERSAL 2PZS AMARILLO",
        "cantidad": "10",
        "precioUnitario": "8.295999",
        "descuento": "0",
        "precioTotalSinImpuesto": "82.96",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>82.96</baseImponible>\r\n\t\t<valor>12.44</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 21,
        "codigoPrincipal": "ETOPE008",
        "codigoAuxiliar": "",
        "descripcion": "TOPE NEGRO PAR",
        "cantidad": "25",
        "precioUnitario": "2.348",
        "descuento": "0",
        "precioTotalSinImpuesto": "58.7",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"MEDIANOS\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>58.7</baseImponible>\r\n\t\t<valor>8.8</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 22,
        "codigoPrincipal": "EDONA0001",
        "codigoAuxiliar": "",
        "descripcion": "DONA NEGRO",
        "cantidad": "10",
        "precioUnitario": "1.174",
        "descuento": "0",
        "precioTotalSinImpuesto": "11.74",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>11.74</baseImponible>\r\n\t\t<valor>1.76</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 23,
        "codigoPrincipal": "EFORR009",
        "codigoAuxiliar": "",
        "descripcion": "FORRO ACIENTO PULSAR NS200 NEGRO",
        "cantidad": "25",
        "precioUnitario": "3.252",
        "descuento": "0",
        "precioTotalSinImpuesto": "81.3",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"sd\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>81.3</baseImponible>\r\n\t\t<valor>12.19</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 24,
        "codigoPrincipal": " ESC004",
        "codigoAuxiliar": "",
        "descripcion": "ESCAPE AX 100",
        "cantidad": "4",
        "precioUnitario": "22.304",
        "descuento": "0",
        "precioTotalSinImpuesto": "89.21",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"MODIFICADO\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>89.21</baseImponible>\r\n\t\t<valor>13.38</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 25,
        "codigoPrincipal": "EPF001",
        "codigoAuxiliar": "",
        "descripcion": "PROTECTOR DE FARO NS200                      ",
        "cantidad": "3",
        "precioUnitario": "6.261",
        "descuento": "0",
        "precioTotalSinImpuesto": "18.78",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"  NEGRO      \"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>18.78</baseImponible>\r\n\t\t<valor>2.81</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 26,
        "codigoPrincipal": "ESLD068",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER UNIVERSAL CHIVO NEGRO",
        "cantidad": "5",
        "precioUnitario": "17.217",
        "descuento": "0",
        "precioTotalSinImpuesto": "86.08",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>86.08</baseImponible>\r\n\t\t<valor>12.91</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 27,
        "codigoPrincipal": "EBAS004",
        "codigoAuxiliar": "",
        "descripcion": "BASE ALOGENO BARRA INVERTIDA",
        "cantidad": "25",
        "precioUnitario": "3.913",
        "descuento": "0",
        "precioTotalSinImpuesto": "97.82",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"50 MM PAR\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>97.82</baseImponible>\r\n\t\t<valor>14.67</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 28,
        "codigoPrincipal": "ESLD074",
        "codigoAuxiliar": "",
        "descripcion": "SLIDER TUKO CR5 250",
        "cantidad": "4",
        "precioUnitario": "26.609",
        "descuento": "0",
        "precioTotalSinImpuesto": "106.43",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"4 TOPES\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>106.43</baseImponible>\r\n\t\t<valor>15.96</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 29,
        "codigoPrincipal": "EFORR021",
        "codigoAuxiliar": "",
        "descripcion": "FORRO SÁBANA",
        "cantidad": "20",
        "precioUnitario": "2.174",
        "descuento": "0",
        "precioTotalSinImpuesto": "43.48",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\" NEGRO SOLO\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>43.48</baseImponible>\r\n\t\t<valor>6.52</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 30,
        "codigoPrincipal": "EBAS005",
        "codigoAuxiliar": "",
        "descripcion": "BASE ALOGENO BARRA NORMAL",
        "cantidad": "25",
        "precioUnitario": "3.913",
        "descuento": "0",
        "precioTotalSinImpuesto": "97.82",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"40 MM PAR\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>97.82</baseImponible>\r\n\t\t<valor>14.67</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 31,
        "codigoPrincipal": "EBAS006",
        "codigoAuxiliar": "",
        "descripcion": "BASE ALOGENO EXPLORADOR",
        "cantidad": "10",
        "precioUnitario": "2.348",
        "descuento": "0",
        "precioTotalSinImpuesto": "23.48",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"ESPEJO\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>23.48</baseImponible>\r\n\t\t<valor>3.52</valor>\r\n\t</impuesto>\r\n</impuestos>"
    },
    {
        "idDetalle": 32,
        "codigoPrincipal": "EPAR059",
        "codigoAuxiliar": "",
        "descripcion": "PARRILLA GN    ",
        "cantidad": "5",
        "precioUnitario": "5.87",
        "descuento": "0",
        "precioTotalSinImpuesto": "29.35",
        "detAdicionalNombre": null,
        "detAdicionalValor": null,
        "detallesAdicionales": "<detallesAdicionales>\r\n\t<detAdicional nombre=\"descripcion\" valor=\"SD\"/>\r\n</detallesAdicionales>",
        "impuestos": "<impuestos>\r\n\t<impuesto>\r\n\t\t<codigo>2</codigo>\r\n\t\t<codigoPorcentaje>4</codigoPorcentaje>\r\n\t\t<tarifa>15</tarifa>\r\n\t\t<baseImponible>29.35</baseImponible>\r\n\t\t<valor>4.4</valor>\r\n\t</impuesto>\r\n</impuestos>"
    }
]
	
	'


	 DECLARE @idUsuario INT
    DECLARE @idEntidad INT
    DECLARE @rucProv VARCHAR(20)
    DECLARE @idProveedor INT
    DECLARE @customerId INT


	DECLARE @tmp TABLE(
        idDocumento INT NOT NULL
        ,idArticulo INT NULL
        ,codigoPrincipal VARCHAR(100) NOT NULL
        ,codigoAuxiliar VARCHAR(100) NULL
        ,cantidad VARCHAR(100) NOT NULL
        ,descripcion VARCHAR(300) NOT NULL
        ,precioUnitario VARCHAR(15) NOT NULL
        ,descuento VARCHAR(15) NULL
        ,precioTotalSinImpuesto VARCHAR(15) NULL
        ,impuestos XML
        ,detallesAdicionales XML
        ,idDetalle INT NULL
    )

 


	        INSERT INTO @tmp(idDetalle, idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, detallesAdicionales, impuestos)
        SELECT idDetalle, @idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, detallesAdicionales, impuestos
        FROM OPENJSON(@jsonData) WITH (
            idDetalle INT '$.idDetalle'
            ,idArticulo INT '$.idArticulo'
            ,codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
            ,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
            ,cantidad VARCHAR(100) '$.cantidad'
            ,descripcion VARCHAR(300) '$.descripcion'
            ,precioUnitario VARCHAR(15) '$.precioUnitario'
            ,descuento VARCHAR(15) '$.descuento'
            ,precioTotalSinImpuesto VARCHAR(15) '$.precioTotalSinImpuesto'
            ,detallesAdicionales XML '$.detallesAdicionales'
            ,impuestos XML
        )
 

        IF NOT EXISTS (SELECT 1 FROM @tmp)
        BEGIN
            SELECT '0' code, 'No existe datos para registrar' as 'message'
            RETURN
        END

        SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

        SELECT @rucProv = rucEmisor FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento 

        SELECT TOP 1 @customerId = Id FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @rucProv

        SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND CustomerId = @customerId



		 IF EXISTS(
                SELECT TOP 1 1 
                FROM Recepcion.Doc_Detalle_Temp cpt WITH (NOLOCK)
                INNER JOIN @tmp t ON cpt.idDocumento = t.idDocumento
            )
            BEGIN
                DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
            END

            IF EXISTS(
                SELECT TOP 1 1 
                FROM Recepcion.Doc_Impuesto_Temp cpt WITH (NOLOCK)
                INNER JOIN @tmp t ON cpt.idDocumento = t.idDocumento
            )
            BEGIN
                DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
            END

            IF EXISTS (
                SELECT TOP 1 1 
                FROM Recepcion.DocumentoDetalle WITH (NOLOCK) 
                WHERE idDocumento = @idDocumento
            )
            BEGIN  

			print 'inside here'
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY dd.idDocumentoDetalle ASC) - 1 idDetalle, 
                    dd.idDocumento,
                    @idProveedor idProveedor, 
                    ISNULL(dd.idArticulo , 0) idArticulo, 
                    dd.idMedida, 
                    dd.codigoPrincipal, 
                    dd.codigoAuxiliar,
                    dd.cantidad, 
                    ISNULL(t.descripcion, a.descripcion) descripcion, 
                    dd.precioUnitario,
                    dd.precioTotalSinImpuesto,
                    CAST((CAST(dd.precioTotalSinImpuesto AS decimal(15,5)) / CAST(dd.cantidad AS decimal(18,5))) AS numeric(18,5)) costoNeto,
                    dd.descuento,
                    CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), dd.detallesAdicionales))))= 0 THEN NULL ELSE dd.detallesAdicionales END detallesAdicionales,
                    dd.impuestos,
                    @idUsuario idUsuario
                INTO #TEMP
                FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK)
                INNER JOIN Articulo a WITH (NOLOCK) ON dd.idArticulo = a.idArticulo
                LEFT JOIN @tmp t ON a.codigo = t.codigoPrincipal
                WHERE dd.idDocumento = @idDocumento

				--select * from #TEMP
				--return

                --INSERT INTO #TEMP
                SELECT 
                    t.idDetalle, 
                    idDocumento, 
                    @idProveedor idProveedor, 
                    ISNULL(ch.idArticulo,0) idArticulo, 
                    ISNULL(m.idMedida,0), 
                    t.codigoPrincipal, 
                    t.codigoAuxiliar,
                    cantidad, 
                    ISNULL(t.descripcion, a.descripcion) descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto,
                    CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)) costoNeto,
                    descuento, 
                    CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), detallesAdicionales))))= 0 THEN NULL ELSE detallesAdicionales END detallesAdicionales,
                    impuestos,
                    @idUsuario idUsuario
                FROM @tmp t
                LEFT JOIN Recepcion.CompraHabitual ch WITH (NOLOCK) ON t.codigoPrincipal = ch.codArticulo AND ch.idProveedor = @idProveedor
                LEFT JOIN dbo.Articulo a WITH (NOLOCK) ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad AND a.estado = 1
                LEFT JOIN dbo.Medida m WITH (NOLOCK) ON a.idMedida = m.idMedida AND m.idEntidad = @idEntidad
                WHERE NOT EXISTS(
                    SELECT * 
                    FROM #TEMP tt 
                    WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal
                )
                ORDER BY t.idDetalle ASC

                --INSERT INTO Recepcion.Doc_Detalle_Temp(
                --    idDetalle, 
                --    idDocumento, 
                --    idProveedor, 
                --    idArticulo, 
                --    idMedida, 
                --    codigoPrincipal, 
                --    codigoAuxiliar,
                --    cantidad, 
                --    descripcion, 
                --    precioUnitario, 
                --    precioTotalSinImpuesto, 
                --    costoNeto, 
                --    descuento, 
                --    detallesAdicionales, 
                --    impuestos, 
                --    idUsuario
                --)
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY (SELECT NULL)), 
                    idDocumento, 
                    idProveedor, 
                    idArticulo, 
                    idMedida, 
                    codigoPrincipal, 
                    codigoAuxiliar,
                    cantidad, 
                    descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto, 
                    costoNeto, 
                    descuento, 
                    detallesAdicionales, 
                    impuestos, 
                    idUsuario
                FROM #TEMP

                DROP TABLE #TEMP
            END
            ELSE
            BEGIN
                SELECT 
                    t.idDetalle, 
                    idDocumento, 
                    @idProveedor idProveedor, 
                    ISNULL(ch.idArticulo , 0) idArticulo, 
                    ISNULL(m.idMedida,0) idMedida, 
                    t.codigoPrincipal, 
                    t.codigoAuxiliar,
                    cantidad, 
                    t.descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto,
                    CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)) costoNeto,
                    descuento, 
                    CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), detallesAdicionales))))= 0 THEN NULL ELSE detallesAdicionales END detallesAdicionales,
                    impuestos,
                    @idUsuario idUsuario
                INTO #TEMPII
                FROM @tmp t
                LEFT JOIN Recepcion.CompraHabitual ch WITH (NOLOCK) ON t.codigoPrincipal = ch.codArticulo AND ch.idProveedor = @idProveedor
                LEFT JOIN dbo.Articulo a WITH (NOLOCK) ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad AND a.estado = 1
                LEFT JOIN dbo.Medida m WITH (NOLOCK) ON a.idMedida = m.idMedida AND m.idEntidad = @idEntidad
                WHERE NOT EXISTS(
                    SELECT * 
                    FROM Recepcion.Doc_Detalle_Temp tt WITH (NOLOCK)
                    WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal
                )
                ORDER BY t.idDetalle ASC

                --INSERT INTO Recepcion.Doc_Detalle_Temp(
                --    idDetalle, 
                --    idDocumento, 
                --    idProveedor, 
                --    idArticulo, 
                --    idMedida, 
                --    codigoPrincipal, 
                --    codigoAuxiliar,
                --    cantidad, 
                --    descripcion, 
                --    precioUnitario, 
                --    precioTotalSinImpuesto, 
                --    costoNeto, 
                --    descuento, 
                --    detallesAdicionales, 
                --    impuestos, 
                --    idUsuario
                --)
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY idDetalle), 
                    idDocumento, 
                    idProveedor, 
                    idArticulo, 
                    idMedida, 
                    codigoPrincipal, 
                    codigoAuxiliar,
                    cantidad, 
                    descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto, 
                    costoNeto, 
                    descuento, 
                    detallesAdicionales, 
                    impuestos, 
                    idUsuario
                FROM #TEMPII

                DROP TABLE #TEMPII
            END

 