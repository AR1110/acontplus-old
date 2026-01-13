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
CREATE OR ALTER PROCEDURE Purchases.NonHabitualInsert
     @UserRoleId INT
    ,@Json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
	
	--> Globales
	DECLARE @idEntidad INT ,@idUsuario INT ,@idDocumentoIngreso INT

    --> Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@artInfoAdicionales VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

	--> Compra 
	DECLARE @idPuntoEmision INT ,@fechaEmision DATETIME ,@uniqueId VARCHAR(20) ,@year VARCHAR(50) ,@secuencial INT
           ,@estab VARCHAR(20) ,@ptoEmi VARCHAR(10) ,@idProveedor INT

	--> contabilidad
	DECLARE @idEstadoPago INT ,@idEstablecimiento INT ,@serieComprobante VARCHAR(20) ,@idCuentaPorPagar INT

    --> Customer
    DECLARE @CustomerId INT 

	DECLARE @document AS TABLE(
		 idPuntoEmision INT NOT NULL
        ,idProveedor INT NOT NULL
        ,idTiempoCredito INT NOT NULL
        ,fechaEmision DATETIME2 NOT NULL
        ,fechaVencimiento DATETIME2 NOT NULL
        ,totalSinImpuestos NUMERIC (18,5) NOT NULL
        ,porcentajeDescuento NUMERIC(18,5) NOT NULL
        ,descuento NUMERIC(18,5) NOT NULL
        ,importeTotal NUMERIC (18,5) NOT NULL
        ,observacion VARCHAR(300) NULL
        ,subcategoryId INT
        ,fechaRegistro DATETIME2 NOT NULL
        ,codDoc VARCHAR(10) DEFAULT 'DH'
	)

	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL DEFAULT 0
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,descuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
		,nota VARCHAR(100) NULL
		,descripcion VARCHAR(255) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCosto NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
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
		,jsonAdicional NVARCHAR(MAX) NOT NULL
		
	)

    DECLARE @tbCuotas AS TABLE(
		nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)
	 
	BEGIN TRY

        --> Globales
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante        = comprobante
              ,@detalles           = detalles
              ,@impuestos          = impuestos
              ,@artInfoAdicionales = artInfoAdicionales
              ,@cuotas             = cuotas
        FROM OPENJSON(@json) WITH 
        (
             comprobante        NVARCHAR(MAX) as json
            ,detalles           NVARCHAR(MAX) as json 
            ,impuestos          NVARCHAR(MAX) as json
            ,artInfoAdicionales NVARCHAR(MAX) as json
            ,cuotas             NVARCHAR(MAX) as json
        )

		INSERT INTO @document 
		      (idPuntoEmision,idProveedor,idTiempoCredito,fechaEmision,fechaVencimiento,totalSinImpuestos,importeTotal,observacion,descuento,porcentajeDescuento,subcategoryId)
		SELECT idPuntoEmision,idProveedor,idTiempoCredito,fechaEmision,fechaVencimiento,totalSinImpuestos,importeTotal,observacion,descuento,porcentajeDescuento,subcategoryId
		FROM OPENJSON(@comprobante)WITH 
        (
             idPuntoEmision         INT           '$.emissionPointId'       
		    ,idProveedor            INT           '$.customerCompanyId'           
		    ,idTiempoCredito        INT           '$.paymentTermId'         
		    ,fechaEmision           DATETIME2     '$.issueDate'  
		    ,fechaVencimiento       DATETIME2     '$.dueDate'    
		    ,totalSinImpuestos      NUMERIC(18,5) '$.subtotal'
            ,descuento              NUMERIC(18,5) '$.discountAmount'
            ,porcentajeDescuento    NUMERIC(18,5) '$.discountPercentage'
		    ,importeTotal           NUMERIC(18,5) '$.totalAmount'
            ,observacion            VARCHAR(300)  '$.obs'
            ,subcategoryId          INT

		) as dt
		
		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idBodega,idMedida,idTipoIva,cantidad,precioUnitario,descuento,porcentajeDescuento,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado)
		SELECT orderIndex,idArticulo,idBodega,idMedida,idTipoIva,cantidad,precioUnitario,descuento,porcentajeDescuento,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex             INT 
		    ,idArticulo             INT           '$.productId'
		    ,idBodega               INT           '$.warehouseId'
		    ,idMedida               INT           '$.unitOfMeasureId'
            ,idTipoIva              INT           '$.taxId'
		    ,cantidad               NUMERIC(15,5) '$.quantity'
		    ,precioUnitario         NUMERIC(15,5) '$.unitPrice'
		    ,descuento              NUMERIC(15,5) '$.discountAmount'
		    ,porcentajeDescuento    NUMERIC(15,5) '$.discountPercentage'
            ,precioTotalSinImpuesto NUMERIC(15,5) '$.subtotal'
            ,valorImpuesto          NUMERIC(15,5) '$.taxAmount'
            ,cantidadTransaccion    NUMERIC(15,5) '$.transactionQuantity'
            ,precioCosto            NUMERIC(15,5) '$.costPrice'
            ,conversion             NUMERIC(15,5) '$.conversionFactor'
            ,precioCostoFraccionado NUMERIC(15,5) '$.fractionalCostPrice'
		    ,nota                   VARCHAR(100)  '$.note'
		    ,descripcion            VARCHAR(255)  '$.description'
            ,llevaInventario        BIT           '$.hasInventoryControl'
		)
		
		INSERT INTO @tbTaxes
              (TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
        SELECT TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount
        FROM OPENJSON(@impuestos) WITH 
        (
            taxId        INT 
	       ,taxPercentId INT
	       ,[percent]    NUMERIC(18,5)
	       ,taxBase      NUMERIC(18,5) 
	       ,taxValue     NUMERIC(18,5) 
           ,discount     NUMERIC(18,5)
        )

        INSERT INTO @tbCuotas
              (nroCuota,fechaVencimiento,cuota,entrada)
        SELECT nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            nroCuota         INT           '$.installmentNumber'
	       ,fechaVencimiento DATE          '$.dueDate'
	       ,cuota            NUMERIC(18,5) '$.installmentAmount'
	       ,entrada          BIT           '$.isDownPayment'
        )
		
		INSERT INTO @artInfoAdicional  
              (idArticulo, idEtiqueta, jsonAdicional)
		SELECT idArticulo, idEtiqueta, jsonAdicional
		FROM OPENJSON(@artInfoAdicionales) WITH 
        (
		   idArticulo    INT
		  ,idEtiqueta    INT
		  ,jsonAdicional NVARCHAR(max) 	
		) 
		
		
		--> Recuperando datos
		SELECT @idPuntoEmision    = js.idPuntoEmision
			  ,@fechaEmision      = js.fechaEmision
              ,@idProveedor       = js.idProveedor
              ,@idEstablecimiento = sr.idEstablecimiento
              ,@estab             = sr.estab
              ,@ptoEmi            = pt.ptoEmi
              ,@CustomerId        = ISNULL(pr.CustomerId,0)
		FROM @document                 js
		INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision    = js.idPuntoEmision
        INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor       = js.idProveedor
        INNER JOIN Sri.Establecimiento sr WITH (NOLOCK) ON sr.idEstablecimiento = pt.idEstablecimiento

        IF (@CustomerId = 0)
            BEGIN
                SELECT '0'code,'Debe validar el proveedor'[message]
				RETURN 
            END

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT @year = DATEPART(YEAR,dbo.ufnGetDateEcuador())

		SELECT @uniqueId = 'D'+@year+Helper.F_Auto_Sequential(COUNT(*)+1) FROM Compra.Documento_Ingreso WITH(NOLOCK) WHERE DATEPART(YEAR,fechaRegistro) = @year

		SELECT @secuencial = COUNT(*)+1 FROM Compra.Documento_Ingreso WITH(NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

		SELECT @serieComprobante = @estab+'-'+@ptoEmi+'-'+Helper.F_Auto_Sequential(@secuencial) FROM @document

		--> Validacacion de informacion
        IF (SELECT COUNT(*) FROM @document) = 0 
            BEGIN
                SELECT '0'code,'Error en la info Factura'[message]
                RETURN
            END

        IF (SELECT COUNT(*) FROM @tblDetails) = 0
			BEGIN
				SELECT '0'code,'Se encontro un error en el detalle del documento'[message]
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @tbTaxes) = 0
			BEGIN
				SELECT '0'code,'Se encontro un error en los impuestos del documento'[message]
				RETURN 
			END 

        IF (SELECT COUNT(*) FROM @tbCuotas) = 0 
            BEGIN
                SELECT '0'code,'Error en las cuotas'[message]
                RETURN
            END

		IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE uniqueId = @uniqueId)
			BEGIN
				SELECT '0'code,'Este Id ya se encuentra registrado'[message]
				RETURN 
			END

		IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND secuencial = @secuencial)
			BEGIN
				SELECT '0'code,'Este secuencial ya se encuentra registrado'[message]
				RETURN 
			END 


		BEGIN TRAN 
			--> Comprobante
            INSERT INTO Compra.Documento_Ingreso WITH (ROWLOCK)
			       (uniqueId,idPuntoEmision,idProveedor,fechaEmision, secuencial,totalSinImpuestos,descuento,porcentajeDescuento,importeTotal,idUsuario,observacion)
			SELECT @uniqueId,idPuntoEmision,idProveedor,fechaEmision,@secuencial,totalSinImpuestos,descuento,porcentajeDescuento,importeTotal,@idUsuario,observacion 
			FROM @document
			
			SET @idDocumentoIngreso = @@IDENTITY

			--> Detalles
			INSERT INTO Compra.Documento_Ingreso_Detail WITH (ROWLOCK)
			       (idDocumentoIngreso,idArticulo,idMedida,idBodega,idTipoIva,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,valorImpuesto)
			SELECT @idDocumentoIngreso,idArticulo,idMedida,idBodega,idTipoIva,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,valorImpuesto
			FROM @tblDetails
            ORDER BY orderIndex ASC
			
			--> Impuestos
            INSERT INTO Compra.DocumentoIngresoImpuesto WITH (ROWLOCK)
                   (DocumentoIngresoId,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount)
            SELECT @idDocumentoIngreso,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount FROM @tbTaxes

			
			IF EXISTS (SELECT 1 FROM @artInfoAdicional)
				BEGIN
					INSERT INTO Compra.InfoAdicional WITH (ROWLOCK) 
                           (uniqueId,idArticulo,idEtiqueta,jsonAdicional,fechaRegistro)
					SELECT @uniqueId,idArticulo,idEtiqueta,jsonAdicional,dbo.ufnGetDateEcuador() 
                    FROM @artInfoAdicional
				END

			--> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
				        BEGIN
                            DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                            SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'IV'

                            SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

                             --> Transaccion
                            INSERT INTO Inventario.Transaccion
                                   (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                            SELECT @idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idDocumentoIngreso,@CustomerId,@idUsuario,@idEntidad,@serieComprobante 
                            FROM @document 

                            SET @idTransaccion = SCOPE_IDENTITY()

                             INSERT INTO Inventario.TransaccionDetalle
                                    (idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total)
			                 SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,precioTotalSinImpuesto 
                             FROM @tblDetails 
                             WHERE llevaInventario = 1

                             EXEC dbo.Transaccion_Handler_Init @idTransaccion

                             IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE codMetodoValoracion = 'UEPS' AND idEntidad = @idEntidad)
                                BEGIN
                                    UPDATE ar SET
                                           ar.fechaUltimoCosto = CASE WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.fechaUltimoCosto
                                                                                                                ELSE @fechaEmision
                                                                 END
                                          ,ar.precioCosto     =  CASE WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.precioCosto
                                                                                                                ELSE IIF((SELECT TOP 1 MAX(td.precioUnitario) FROM @tblDetails td WHERE td.llevaInventario = 1 and td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida) >= (ar.precioCosto / 2)
                                                                                                                        ,(SELECT TOP 1 MAX(td.precioUnitario) FROM @tblDetails td WHERE td.llevaInventario = 1 and td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida)
                                                                                                                        ,ar.precioCosto) 
                                                                                                                 
                                                                 END
                                    FROM dbo.Articulo ar WITH (ROWLOCK)
                                    WHERE ar.idArticulo IN (SELECT idArticulo FROM @tblDetails td WHERE td.llevaInventario = 1)  

                                    UPDATE pv SET
                                           pv.porcentajeUtilidad = ((pv.precioVenta / ar.precioCosto) * 100) - 100
                                    FROM dbo.ArticuloPvP pv WITH (ROWLOCK)
                                    INNER JOIN dbo.Articulo ar WITH (ROWLOCK) ON ar.idArticulo = pv.idArticulo
                                    WHERE ar.idArticulo IN (SELECT idArticulo FROM @tblDetails td WHERE td.llevaInventario = 1)

                                END 
                        END
				END

			--> Contabilidad 
			INSERT INTO Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                   (idEstablecimiento,idTiempoCredito,idProveedor, idEstadoPago,codDoc, idDocumento, uniqueId,serieComprobante,
                   fechaEmision,fechaVencimiento,importeTotal, idUsuario, subcategoryId)
		    SELECT @idEstablecimiento,idTiempoCredito,idProveedor,@idEstadoPago,codDoc,@idDocumentoIngreso,@uniqueId,@serieComprobante,
            fechaEmision,fechaVencimiento,importeTotal,@idUsuario, subcategoryId
            FROM @document

            SELECT @idCuentaPorPagar = SCOPE_IDENTITY()

            INSERT INTO Contabilidad.CuotaPorPagar WITH (ROWLOCK)
                   (idCuentaPorPagar, idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada)
			SELECT @idCuentaPorPagar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada FROM @tbCuotas 
			
		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente'[message]
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END 

		INSERT INTO ErroresSistema
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/CompraHabitual/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0'code,'Error en el procedimiento'[message]
	END CATCH
END
GO
