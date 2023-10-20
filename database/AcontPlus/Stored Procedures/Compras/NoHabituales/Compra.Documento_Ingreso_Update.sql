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
-- Description:	SP para actualizar los documentos de ingreso.
-- =============================================
IF OBJECT_ID(N'Compra.Documento_Ingreso_Update', N'P') IS NOT NULL
DROP PROCEDURE Compra.Documento_Ingreso_Update
GO
CREATE PROCEDURE Compra.Documento_Ingreso_Update 
	@idUsuarioRol AS INT
   ,@idDocumentoIngreso AS INT 
   ,@comprobante AS VARCHAR(MAX)
   ,@detalles AS VARCHAR(MAX)
   ,@impuestos AS VARCHAR(MAX)
   ,@artInfoAdicionales VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	--=============Datos capturados desde BD===========================
	DECLARE @idUsuario AS INT 


	--===========Datos para la validacion de informacion===============
	DECLARE @uniqueId AS VARCHAR(20)
	DECLARE @fechaEmision AS DATETIME

	--==============Parametros para el area de contabilidad============
	DECLARE @idEstadoPago AS INT
	DECLARE @idTiempoCredito AS INT 
	DECLARE @codPago AS VARCHAR(5)


    --==============Inventario==============
	DECLARE @idArticulo INT ,@idBodega INT ,@idMedida INT ,@idTipoTransaccion  INT ,@idTipoDocumento INT
	       ,@cantidad NUMERIC(18,2) ,@precioUnitario NUMERIC(18,5) ,@precioCosto NUMERIC(18,5) ,@precioTotalSinImpuesto NUMERIC(18,5)
           ,@fraccion NUMERIC(18,5) ,@fechaConsolidacion DATETIME ,@stock NUMERIC(18,5) ,@inventory VARCHAR(5) ,@cantidadActual NUMERIC(18,5)
           ,@estado BIT 

	--==========Tablas temporales para la validacion===================
	DECLARE @document AS TABLE(
		 idDocumentoIngreso INT NOT NULL
        ,idProveedor INT NOT NULL
        ,fechaEmision DATETIME NOT NULL
        ,totalSinImpuestos NUMERIC (18,5) NOT NULL
        ,importeTotal NUMERIC (18,5) NOT NULL
		,inventory VARCHAR(5) NOT NULL
	)

	DECLARE @detail AS TABLE(
		 idDocumentoIngresoDetail INT NOT NULL
		,idArticulo INT NOT NULL
        ,idMedida INT NOT NULL
        ,idBodega INT NOT NULL
        ,codigoPrincipal VARCHAR(100) NOT NULL
        ,codigoAuxiliar VARCHAR(100) NOT NULL
        ,descripcion VARCHAR(300) NOT NULL
        ,cantidad NUMERIC (18,5)   NOT NULL
        ,precioUnitario NUMERIC (18,5)  NOT NULL
        ,costoNeto NUMERIC (18,5)  NOT NULL
        ,descuento NUMERIC (18,5)  NOT NULL
        ,precioTotalSinImpuesto NUMERIC (18,5)  NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
		,estado BIT NULL
	)

	DECLARE @taxes AS TABLE(
		 idArticulo INT NOT NULL
		,codigo VARCHAR(5)  NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,baseImponible NUMERIC(18,5) NOT NULL
        ,valor NUMERIC(18,5) NOT NULL
	)

	--Etiquetas
	DECLARE @artInfoAdicional AS TABLE (
		idInfoAdicional INT NOT NULL
		,idArticulo INT  NOT NULL		
		,idEtiqueta INT  NOT NULL
		,jsonAdicional NVARCHAR(MAX)  NULL
		
	)


	BEGIN TRY 
					
		INSERT INTO @document 
		       (idDocumentoIngreso,idProveedor,fechaEmision,totalSinImpuestos,importeTotal,inventory)
		SELECT @idDocumentoIngreso,idProveedor,fechaEmision,totalSinImpuestos,importeTotal,inventory
		FROM OPENJSON(@comprobante) WITH 
        (
		     idProveedor                 INT '$.idProveedor' 
		    ,fechaEmision           DATETIME '$.fechaEmision'
		    ,totalSinImpuestos NUMERIC(18,5) '$.totalSinImpuestos'
		    ,importeTotal      NUMERIC(18,5) '$.importeTotal'
		    ,inventory            VARCHAR(5) '$.inventory'
		) as dt
		
		INSERT INTO @detail
		      (idDocumentoIngresoDetail,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje)
		SELECT idDocumentoIngresoDetail,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje
		FROM OPENJSON(@detalles) WITH 
        (
		     idDocumentoIngresoDetail         INT '$.idDocumentoIngresoDetail'
		    ,idArticulo                       INT '$.idArticulo'
		    ,idMedida                         INT '$.idMedida'
		    ,idBodega                         INT '$.idBodega'
		    ,codigoPrincipal         VARCHAR(100) '$.codigoPrincipal'
		    ,codigoAuxiliar          VARCHAR(100) '$.codigoAuxiliar'
		    ,descripcion             VARCHAR(300) '$.descripcion'
		    ,cantidad               NUMERIC(18,5) '$.cantidad'  
		    ,precioUnitario         NUMERIC(18,5) '$.precioUnitario' 
		    ,costoNeto              NUMERIC(18,5) '$.costoNeto' 
		    ,descuento              NUMERIC(18,5) '$.descuento' 
		    ,precioTotalSinImpuesto NUMERIC(18,5) '$.precioTotalSinImpuesto' 
		    ,codigoPorcentaje          VARCHAR(5) '$.codigoPorcentaje'
		) as dt
		
		INSERT INTO @taxes (idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor)
		SELECT idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor
		FROM OPENJSON(@impuestos) WITH 
        (
		     idArticulo              INT '$.idArticulo'
		    ,codigo           VARCHAR(5) '$.codigo'
		    ,codigoPorcentaje VARCHAR(5) '$.codigoPorcentaje'
		    ,tarifa        NUMERIC(18,5) '$.tarifa'
            ,baseImponible NUMERIC(18,5) '$.baseImponible'
            ,valor         NUMERIC(18,5) '$.valor'
	    ) as dt


		----------------------------------Datos Adicionales ---------------------------------------------
		INSERT INTO @artInfoAdicional  
              (idInfoAdicional, idArticulo, idEtiqueta, jsonAdicional)
		SELECT idInfoAdicional, idArticulo, idEtiqueta, jsonAdicional
		FROM OPENJSON(@artInfoAdicionales) WITH 
        (
		     idInfoAdicional INT
		    ,idArticulo      INT
		    ,idEtiqueta      INT
		    ,jsonAdicional NVARCHAR(max) '$.jsonAdicional' AS JSON		
		) 

		----======================================Recuperar datos de las Tablas===========================================================
		SELECT TOP 1 @fechaEmision = fechaEmision ,@inventory = inventory FROM @document

		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @uniqueId =  uniqueId FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idDocumentoIngreso = @idDocumentoIngreso 

		SELECT TOP 1 @idEstadoPago = idEstadoPago, @idTiempoCredito = idTiempoCredito FROM Contabilidad.CuentaPorPagar WITH (NOLOCK) WHERE uniqueId = @uniqueId

		SELECT TOP 1 @codPago = codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE idEstadoPago = @idEstadoPago

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'IV'

        SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

		--==================================Validacion de la informacion============================================================

		IF @idTiempoCredito IS NOT NULL
			BEGIN
				SELECT '0' code,'El Documento tiene cuotas generadas no puede ser editado' as 'message'
				RETURN
			END 

		IF @codPago != 'PE'
			BEGIN 
				SELECT '0'code, 'Ya se ha realizado el cobro de algunas de las cuotas correspondientes a este documento.' as 'message'
				RETURN  
			END 

		IF (SELECT COUNT(*) FROM @detail) = 0
			BEGIN
				SELECT '0' code,'Se encontro un error en el detalle del documento' as 'message'
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @taxes) = 0
			BEGIN
				SELECT '0' code,'Se encontro un error en los impuestos del documento' as 'message'
				RETURN 
			END 

		BEGIN TRAN 
			
			--============================================================Administracion=========================================================================================
			UPDATE di SET 
				di.idProveedor       = dc.idProveedor
			   ,di.fechaEmision      = dc.fechaEmision
			   ,di.totalSinImpuestos = dc.totalSinImpuestos
			   ,di.importeTotal      = dc.importeTotal
			FROM Compra.Documento_Ingreso di WITH (NOLOCK)
			INNER JOIN @document dc ON dc.idDocumentoIngreso = di.idDocumentoIngreso
			 
			UPDATE Compra.Documento_Ingreso_Detail SET estado = 0 WHERE idDocumentoIngreso = @idDocumentoIngreso

			UPDATE dd SET
				dd.idMedida = dt.idMedida
			   ,dd.idBodega = dt.idBodega
			   ,dd.cantidad = dt.cantidad
			   ,dd.precioUnitario = dt.precioUnitario
			   ,dd.descuento = dt.descuento
			   ,dd.precioTotalSinImpuesto = dt.precioTotalSinImpuesto
			   ,dd.codigoPorcentaje = dt.codigoPorcentaje
			   ,dd.estado = 1
			FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK)
			INNER JOIN @detail dt ON dt.idDocumentoIngresoDetail = dd.idDocumentoIngresoDetail

			INSERT INTO Compra.Documento_Ingreso_Detail
			       (idDocumentoIngreso,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje)
			SELECT @idDocumentoIngreso,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje
			FROM @detail WHERE idDocumentoIngresoDetail = 0 


			DELETE FROM Compra.Documento_Ingreso_Taxes WHERE idDocumentoIngreso = @idDocumentoIngreso

			INSERT INTO Compra.Documento_Ingreso_Taxes
                   (idDocumentoIngreso,idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor)
			SELECT @idDocumentoIngreso,idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor
			FROM @taxes

			
			---------------------------------SRTART Insert o Update Etiqueta -------------------------------
			UPDATE Compra.InfoAdicional SET estado = 0 WHERE uniqueId = @uniqueId AND estado = 1
			UPDATE  infoAdd SET infoAdd.idEtiqueta =  temp.idEtiqueta, infoAdd.jsonAdicional = temp.jsonAdicional, infoAdd.estado = 1 
			FROM  Compra.InfoAdicional infoAdd WITH(NOLOCK) 
			INNER JOIN @artInfoAdicional temp ON temp.idInfoAdicional = infoAdd.idInfoAdicional

			INSERT INTO  Compra.InfoAdicional (uniqueId, idArticulo, idEtiqueta, jsonAdicional, fechaRegistro)
			SELECT @uniqueId, idArticulo, idEtiqueta, jsonAdicional, dbo.ufnGetDateEcuador() FROM @artInfoAdicional WHERE idInfoAdicional = 0 

			DELETE FROM Compra.InfoAdicional 
			WHERE estado = 0  AND uniqueId = @uniqueId
			---------------------------------END Insert o Update Etiqueta -------------------------------


			--==============================================================Inventario============================================================================================
			IF @inventory = 'SI'
				BEGIN 

					DELETE FROM Inventario.Transaccion WITH (ROWLOCK) WHERE idDocumento = @idDocumentoIngreso AND idTipoDocumento = @idTipoDocumento AND idTipoTransaccion = @idTipoTransaccion

					IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK) INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = dd.idArticulo WHERE dd.idDocumentoIngreso = @idDocumentoIngreso AND  ar.llevaInventario = 1)
						BEGIN 

							DECLARE cursor_inventory CURSOR LOCAL FOR
							SELECT dd.idArticulo,dd.idBodega,dd.idMedida,dd.cantidad,dd.precioUnitario - dd.descuento,dd.precioUnitario - dd.descuento,dd.precioTotalSinImpuesto,dd.estado
							FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK)
							INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = dd.idArticulo
							WHERE dd.idDocumentoIngreso = @idDocumentoIngreso AND ar.llevaInventario = 1

							OPEN cursor_inventory

							FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto,@estado

							WHILE @@FETCH_STATUS = 0
								BEGIN
									IF @estado = 1
                                        BEGIN
									        INSERT INTO Inventario.Transaccion WITH(ROWLOCK)
				                                   (idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, idMedida ,cantidad, precioCosto, precioUnitario, total,fechaRegistro, idUsuario)
			                                SELECT @idTipoTransaccion,@idArticulo,@idBodega,@idTipoDocumento,@idDocumentoIngreso,@idMedida,@cantidad,@precioCosto,@precioUnitario,@precioTotalSinImpuesto,@fechaEmision,@idUsuario
									    END

                                    IF EXISTS (SELECT 1 FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idBodega = @idBodega AND fechaConsolidacion IS NOT NULL)
                                            BEGIN
                                                  SELECT TOP 1 @fechaConsolidacion = fechaConsolidacion , @cantidad = consolidacion  FROM Inventario.Stock WITH(NOLOCK)  WHERE idArticulo = @idArticulo AND idBodega = @idBodega

                                                  SELECT @cantidadActual = @cantidad + ISNULL(sum(cantidadEntrada - cantidadSalida),0)
			                                      FROM Inventario.v_Articulo_Transaccion WITH (NOLOCK)
			                                      WHERE idBodega = @idbodega 
			                                        AND idArticulo = @idarticulo
			                                        AND estado = 1 
			                                        AND codTransaccion in ('E','S')
			                                        AND fechaRegistro >= @fechaConsolidacion 
                                             END 
                                    
                                    ELSE
                                        BEGIN
                                            SELECT @cantidadActual = ISNULL(sum(cantidadEntrada - cantidadSalida),0)
			                                FROM Inventario.v_Articulo_Transaccion WITH (NOLOCK)
			                                WHERE idBodega = @idbodega 
			                                  AND idArticulo = @idarticulo 
			                                  AND estado = 1 
			                                  AND codTransaccion in ('E','S')
                                        END 

                                    UPDATE Inventario.Stock WITH(ROWLOCK) SET cantidad = ISNULL(@cantidadActual,0) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

	                                SELECT @stock = SUM(cantidad) FROM Inventario.Stock s WITH (NOLOCK) WHERE idArticulo = @idArticulo AND s.estado = 1

	                                UPDATE dbo.Articulo WITH(ROWLOCK) SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo
								
                                    FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto,@estado
									
								END
							CLOSE cursor_inventory
							DEALLOCATE cursor_inventory  
						END
				END 

			 DELETE FROM Compra.Documento_Ingreso_Detail WHERE estado = 0 AND idDocumentoIngreso = @idDocumentoIngreso

			 --===========================================================Contabilidad=================================================================================================
			 UPDATE cp SET 
				 cp.idProveedor    = di.idProveedor
				,cp.identificacion = pr.numeroIdentificacion
				,cp.fechaEmision   = di.fechaEmision
				,cp.importeTotal   = di.importeTotal
			 FROM Contabilidad.CuentaPorPagar    cp WITH (NOLOCK)
			 INNER JOIN Compra.Documento_Ingreso di WITH (NOLOCK) ON di.uniqueId    = cp.uniqueId
			 INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor = di.idProveedor 

		COMMIT TRAN 
		SELECT '1' code,'Actualizado Correctamente' as 'message'
		RETURN

	END TRY 

	BEGIN CATCH 
		SELECT '0' code, 'Error en el procedimiento ' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoIngreso/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
GO
