DECLARE @Document_Emit_info_Tributaria table
(
    idDocument_Emit_info_Tributaria INT IDENTITY(1,1) NOT NULL
   ,uniqueId VARCHAR(150) UNIQUE NOT NULL
   ,versionComp VARCHAR(15) NOT NULL
   ,ambiente VARCHAR(5) NOT NULL
   ,tipoEmision VARCHAR(5) NOT NULL
   ,razonSocial VARCHAR(200) NOT NULL
   ,nombreComercial VARCHAR(200) NOT NULL
   ,ruc VARCHAR(15) NOT NULL
   ,claveAcceso VARCHAR(49) UNIQUE NOT NULL 
   ,codDoc VARCHAR(2) NOT NULL
   ,estab VARCHAR(5) NOT NULL
   ,ptoEmi VARCHAR(5) NOT NULL
   ,secuencial INT NOT NULL
   ,dirMatriz VARCHAR(500) NOT NULL
   ,agenteRetencion VARCHAR(150) NULL
   ,contribuyenteRimpte VARCHAR(150) NULL
   ,isAutomatic INT NOT NULL
   ,fechaAutorizacion DATETIME NULL
   ,codEstab INT NOT NULL
   ,xmlAcontplus VARCHAR(MAX) NOT NULL
   ,xmlSri XML
)

DECLARE @Document_Emit_Factura table
(
    idDocument_Emiti_Factura   INT IDENTITY(1,1) NOT NULL
   ,uniqueId VARCHAR(150) NOT NULL --ENTIDASD RELACION CON LA TABLA @Document_Emit_info_Tributaria
   ,fechaEmision DATETIME NOT NULL
   ,dirEstablecimiento VARCHAR(300) NULL	
   ,contribuyenteEspecial VARCHAR(20) NULL
   ,obligadoContabilidad VARCHAR(5) NOT NULL
   ,tipoIdentificacionComprador VARCHAR(5) NOT NULL
   ,guiaRemision VARCHAR(200) NOT NULL
   ,razonSocialComprador VARCHAR(20) NOT NULL
   ,identificacionComprador VARCHAR(300) NULL
   ,direccionComprador VARCHAR(150) NULL
   ,totalSinImpuestos DECIMAL(15,5) NOT NULL
   ,totalDescuento DECIMAL(15,5) NOT NULL
   ,totalConImpuestos DECIMAL(15,5) NOT NULL
   ,propina DECIMAL(15,5) NOT NULL
   ,importeTotal DECIMAL(15,5) NOT NULL
   ,moneda VARCHAR(50) DEFAULT 'DOLAR'
   ,placa VARCHAR(80) NULL
   ,codigoPorcentaje VARCHAR(5)
   ,tarifa DECIMAL(15,5)
)