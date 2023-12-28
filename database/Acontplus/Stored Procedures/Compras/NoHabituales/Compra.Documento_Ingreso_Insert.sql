USE [AcontPlus]
GO 

-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 03/16/2023
-- Description:	SP para listar las compras que no tiene documento validado por el sri.
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Documento_Ingreso_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
	
	--> Globales
	DECLARE @idEntidad INT ,@idUsuario INT ,@idDocumentoIngreso INT

    --> Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@artInfoAdicionales VARCHAR(MAX)

	--> Compra 
	DECLARE @idPuntoEmision INT ,@fechaEmision DATETIME ,@uniqueId VARCHAR(20) ,@year VARCHAR(50) ,@secuencial INT
           ,@estab VARCHAR(20) ,@ptoEmi VARCHAR(10)

	--> contabilidad
	DECLARE @idEstadoPago INT ,@idEstablecimiento INT ,@identificacion VARCHAR(20) ,@serieComprobante VARCHAR(20)

	DECLARE @document AS TABLE(
		 idPuntoEmision INT NOT NULL
        ,idProveedor INT NOT NULL
        ,codDoc VARCHAR(5) DEFAULT 'DH' NOT NULL
        ,fechaEmision DATETIME2 NOT NULL
        ,totalSinImpuestos NUMERIC (18,5) NOT NULL
        ,porcentajeDescuento NUMERIC(18,5) NOT NULL
        ,descuento NUMERIC(18,5) NOT NULL
        ,importeTotal NUMERIC (18,5) NOT NULL
        ,observacion VARCHAR(300) NULL
	)

	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,descuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
		,nota VARCHAR(100) NULL
		,descripcion VARCHAR(255) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
	)

	DECLARE @tbTaxes AS TABLE (
        TaxId INT NOT NULL 
	   ,TaxPercentId INT NOT NULL 
	   ,[Percent] NUMERIC(18,5) NOT NULL
	   ,TaxBase NUMERIC(18,5) NOT NULL
	   ,TaxValue NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL
    )

	 
	DECLARE @artInfoAdicional AS TABLE (
		idArticulo INT  NOT NULL		
		,idEtiqueta INT  NOT NULL
		,jsonAdicional NVARCHAR(MAX)  NULL
		
	)
	 
	BEGIN TRY

        --> Globales
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante        = comprobante
              ,@detalles           = detalles
              ,@impuestos          = impuestos
              ,@artInfoAdicionales = artInfoAdicionales
        FROM OPENJSON(@json) WITH 
        (
             comprobante        NVARCHAR(MAX) as json
            ,detalles           NVARCHAR(MAX) as json 
            ,impuestos          NVARCHAR(MAX) as json
            ,artInfoAdicionales NVARCHAR(MAX) as json
        )


		INSERT INTO @document 
		      (idPuntoEmision,idProveedor,fechaEmision,totalSinImpuestos,importeTotal,observacion,descuento,porcentajeDescuento)
		SELECT idPuntoEmision,idProveedor,fechaEmision,totalSinImpuestos,importeTotal,observacion,descuento,porcentajeDescuento
		FROM OPENJSON(@comprobante)WITH 
        (
             idPuntoEmision      INT           '$.idPuntoEmision'
		    ,idProveedor         INT           '$.idProveedor' 
		    ,fechaEmision        DATETIME2     '$.fechaEmision'
		    ,totalSinImpuestos   NUMERIC(18,5) '$.totalSinImpuestos'
            ,descuento           NUMERIC(18,5) '$.descuento'
            ,porcentajeDescuento NUMERIC(18,5) '$.porcentajeDescuento'
		    ,importeTotal        NUMERIC(18,5) '$.importeTotal'
            ,observacion         VARCHAR(300)  '$.observacion'

		) as dt
		
		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,descuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion)
		SELECT orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,descuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex                       INT '$.orderIndex' 
		    ,idArticulo                       INT '$.idArticulo'
		    ,idBodega                         INT '$.idBodega'
		    ,idMedida                         INT '$.idMedida'
            ,idTipoIva                        INT '$.idTipoIva' 
		    ,ice                    NUMERIC(10,5) '$.ice'
		    ,cantidad               NUMERIC(15,5) '$.cantidad'
		    ,precioUnitario         NUMERIC(15,5) '$.precioUnitario'
		    ,descuento              NUMERIC(15,5) '$.descuento'
		    ,precioTotalSinImpuesto NUMERIC(15,5) '$.precioTotalSinImpuesto'
		    ,porcentajeDescuento    NUMERIC(15,5) '$.porcentajeDescuento'
            ,codigoPorcentaje          VARCHAR(5) '$.codigoPorcentaje'
            ,tarifa                 NUMERIC(15,5) '$.tarifa'
            ,valorImpuesto          NUMERIC(15,5) '$.valorImpuesto'
		    ,precioTotalSinImpuesto NUMERIC(15,5) '$.precioTotalSinImpuesto'
		    ,nota                    VARCHAR(100) '$.nota'
		    ,descripcion             VARCHAR(255) '$.descripcion'
            ,llevaInventario                  BIT '$.llevaInventario'
            ,cantidadTransaccion    NUMERIC(15,5) '$.cantidadTransaccion'
		)
		
		INSERT INTO @tbTaxes
              (TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
        SELECT TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount
        FROM OPENJSON(@impuestos) WITH 
        (
            taxId               INT 
	       ,taxPercentId        INT
	       ,[percent] NUMERIC(18,5)
	       ,taxBase   NUMERIC(18,5) 
	       ,taxValue  NUMERIC(18,5) 
           ,discount  NUMERIC(18,5)
        )

		
		INSERT INTO @artInfoAdicional  
              (idArticulo, idEtiqueta, jsonAdicional)
		SELECT idArticulo, idEtiqueta, jsonAdicional
		FROM OPENJSON(@artInfoAdicionales) WITH 
        (
		  idArticulo INT,
		  idEtiqueta INT,
		  jsonAdicional NVARCHAR(max) '$.jsonAdicional' AS JSON		
		) 
		
		
		--> Recuperando datos
		SELECT @idPuntoEmision    = js.idPuntoEmision
              ,@idEstablecimiento = sr.idEstablecimiento
			  ,@fechaEmision      = js.fechaEmision
              ,@estab             = sr.estab
              ,@ptoEmi            = pto.ptoEmi
              ,@identificacion    = pr.numeroIdentificacion
		FROM @document                 js
		INNER JOIN dbo.PuntoEmision   pto WITH (NOLOCK) ON pto.idPuntoEmision = js.idPuntoEmision
        INNER JOIN Sri.Establecimiento sr WITH (NOLOCK) ON sr.codEstab        = pto.codEstab
        INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor     = js.idProveedor
		
		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT @year = DATEPART(YEAR,dbo.ufnGetDateEcuador())

		SELECT @uniqueId = 'D'+@year+Helper.F_Auto_Sequential(COUNT(*)+1) FROM Compra.Documento_Ingreso WITH(NOLOCK) WHERE DATEPART(YEAR,fechaRegistro) = @year

		SELECT @secuencial = COUNT(*)+1 FROM Compra.Documento_Ingreso WITH(NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

		SELECT @serieComprobante = @estab+'-'+@ptoEmi+'-'+Helper.F_Auto_Sequential(@secuencial) FROM @document

		
		--> Validacacion de informacion
		IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE uniqueId = @uniqueId)
			BEGIN
				SELECT [Common].[ufnSpResponse]('0','Este Id ya se encuentra registrado',DEFAULT)
				RETURN 
			END

		IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND secuencial = @secuencial)
			BEGIN
				SELECT [Common].[ufnSpResponse]('0','Este secuencial ya se encuentra registrado',DEFAULT)
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @tblDetails) = 0
			BEGIN
				SELECT [Common].[ufnSpResponse]('0','Se encontro un error en el detalle del documento',DEFAULT)
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @tbTaxes) = 0
			BEGIN
				SELECT [Common].[ufnSpResponse]('0','Se encontro un error en los impuestos del documento',DEFAULT)
				RETURN 
			END 

        IF CAST(@fechaEmision AS DATE) > dbo.ufnGetDateEcuador()
			BEGIN 
				SELECT [Common].[ufnSpResponse]('0','La fecha de emisión del documento no puede ser posterior a la fecha actual.',DEFAULT)
				RETURN 
			END


		BEGIN TRAN 
			--> Comprobante
            INSERT INTO Compra.Documento_Ingreso
			       (uniqueId,idPuntoEmision,idProveedor,codDoc,fechaEmision, secuencial,totalSinImpuestos,descuento,porcentajeDescuento,importeTotal,fechaRegistro,idUsuario,idEntidad,observacion)
			SELECT @uniqueId,idPuntoEmision,idProveedor,codDoc,fechaEmision,@secuencial,totalSinImpuestos,descuento,porcentajeDescuento,importeTotal,dbo.ufnGetDateEcuador(),@idUsuario,@idEntidad,observacion 
			FROM @document
			
			SET @idDocumentoIngreso = @@IDENTITY

			--> Detalles
			INSERT INTO Compra.Documento_Ingreso_Detail
			       (idDocumentoIngreso,idArticulo,idMedida,idBodega,idTipoIva,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto)
			SELECT @idDocumentoIngreso,idArticulo,idMedida,idBodega,idTipoIva,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto
			FROM @tblDetails
			
			 --> Impuestos
            INSERT INTO Compra.DocumentoIngresoImpuesto
                   (DocumentoIngresoId,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount)
            SELECT @idDocumentoIngreso,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount FROM @tbTaxes

			---Datos Adicionales de articulo (etiquetas)
			IF EXISTS (SELECT 1 FROM @artInfoAdicional WHERE JSON_QUERY(jsonAdicional, '$') IS NOT NULL)
				BEGIN
					INSERT INTO Compra.InfoAdicional(uniqueId, idArticulo, idEtiqueta, jsonAdicional, fechaRegistro)
					SELECT @uniqueId, idArticulo, idEtiqueta, jsonAdicional, dbo.ufnGetDateEcuador() FROM @artInfoAdicional
				END

			--> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
				        BEGIN
                             DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT

                             SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'IV'

                             SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

                             INSERT INTO Inventario.Transaccion 
                                    (idTipoTransaccion,idArticulo,idBodega,idTipoDocumento,idDocumento,idMedida,cantidad,precioUnitario,precioCosto,total,fechaRegistro,idUsuario)
			                 SELECT @idTipoTransaccion,idArticulo,idBodega,@idTipoDocumentoIv,@idDocumentoIngreso,idMedida,cantidadTransaccion,precioUnitario,precioUnitario,precioTotalSinImpuesto,@fechaEmision,@idUsuario 
                             FROM @tblDetails WHERE llevaInventario = 1

                             EXEC dbo.Transaccion_Handler_Init 'E', 'LC', @idDocumentoIngreso, DEFAULT
                        END
				END

			--> Contabilidad 
			INSERT INTO Contabilidad.CuentaPorPagar
                   (idEstablecimiento,idProveedor,idEstadoPago,codDoc,idDocumento,uniqueId,serieComprobante,identificacion,fechaEmision,importeTotal,idEntidad,idUsuario)
		    SELECT @idEstablecimiento,idProveedor,@idEstadoPago,codDoc,@idDocumentoIngreso,@uniqueId,@serieComprobante,@identificacion,fechaEmision,importeTotal,@idEntidad,@idUsuario
		    FROM @document
			
		COMMIT TRAN 
		SELECT [Common].[ufnSpResponse]('1','Registrado Correctamente',DEFAULT)
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END 

        SELECT [Common].[ufnSpResponse]('0','Error en el procedimiento',DEFAULT)

		INSERT INTO ErroresSistema
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/CompraHabitual/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

	END CATCH
END
GO
