USE AcontPlus
GO
/****** Object:  StoredProcedure [Compra].[FacturaCompra_Insert]    Script Date: 10/16/2022 6:04:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-24
-- Description:	SP para registrar facturas de compra

-- =============================================
IF OBJECT_ID(N'Recepcion.Factura_Insert', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Factura_Insert 
GO
CREATE PROCEDURE Recepcion.Factura_Insert
	 @idRol INT 
	,@jsonComp nvarchar(max)
	--,@jsonDetalle nvarchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 

	DECLARE @idEntidad INT
	       ,@idUsuario INT
		   ,@codEstab VARCHAR(50)
		   ,@idEstadoPago INT = (dbo.AFTIdEstadoPago ('PE'))
		   --Datos de Validacion 
		   ,@idFacturaCompra BIGINT 
		   ,@idTipoDocumento INT


	DECLARE @tmp AS TABLE(
			idDocumento INT
		   ,secuencial BIGINT 
		   ,estab VARCHAR(4)
		   ,ptoEmi VARCHAR(4)
		   ,claveAcceso NVARCHAR(50)
		   ,fechaEmision VARCHAR(10)
		   ,codDoc VARCHAR(2) 
		   ,totalDescuento DECIMAL(15,5)
		   ,totalSinImpuestos DECIMAL(15,5)
		   ,importeTotal DECIMAL(15,5)
		   ,propina DECIMAL(15,5)
		   ,idSustentoTributario INT 
		   ,idTiempoCredito INT 
		   ,idCategoriaCompra INT
		   ,idProveedor INT
		   ,idBodega INT
		   ,observacion VARCHAR(300)
		   ,payments VARCHAR(MAX)
		   )

	SELECT @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1
	
	SELECT @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WHERE codigo = 'FC'

	INSERT INTO @tmp(idDocumento,secuencial, estab, ptoEmi,claveAcceso,fechaEmision,codDoc,totalDescuento,totalSinImpuestos,importeTotal,propina,idSustentoTributario
				   ,idTiempoCredito,idCategoriaCompra ,idProveedor, idBodega, observacion, payments)
	SELECT idDocumento, secuencial, estab,ptoEmi,claveAcceso,fechaEmision,codDoc,totalDescuento,totalSinImpuestos ,importeTotal,propina,idSustentoTributario
				   ,idTiempoCredito ,idCategoriaCompra,idProveedor, idBodega,observacion, payments
				   FROM OPENJSON(@jsonComp) WITH (
										idDocumento INT '$.idDocumento'
										,secuencial BIGINT '$.secuencial'
										,estab VARCHAR(4) '$.estab'
									   ,ptoEmi VARCHAR(4) '$.ptoEmi'
									   ,claveAcceso NVARCHAR(50) '$.claveAcceso'
									   ,fechaEmision VARCHAR(10) '$.fechaEmision'
									   ,codDoc VARCHAR(2) '$.codDoc'
									   ,totalDescuento DECIMAL(15,5) '$.totalDescuento'
									   ,totalSinImpuestos DECIMAL(15,5) '$.totalSinImpuestos'
									   ,importeTotal DECIMAL(15,5) '$.importeTotal'
									   ,propina DECIMAL(15,5) '$.propina'
									   ,idSustentoTributario INT '$.idSustentoTributario'
									   ,idTiempoCredito INT '$.idTiempoCredito'
									   ,idCategoriaCompra INT '$.idCategoriaCompra'
									   ,idProveedor INT '$.idProveedor'
									   ,idBodega INT '$.idBodega'
									   ,observacion VARCHAR(300) '$.observacion'
									   ,payments VARCHAR(MAX) '$.payments'
				   )


	IF EXISTS(SELECT 1 FROM FacturaCompra fc 
						INNER JOIN @tmp t ON fc.nroDocumento = t.secuencial 
						AND fc.puntoEmision = t.ptoEmi
						AND fc.idProveedor = t.idProveedor)
		BEGIN
			SELECT '0' code,'Esta Factura de Compra ya se encuentra registrada' AS 'message'
			RETURN 
		END 

	DECLARE @idDocumento INT
	,@idBodega INT

	SELECT @idDocumento = idDocumento, @idBodega = idBodega FROM @tmp

	BEGIN TRY 
		BEGIN TRAN
			DECLARE @subTotalIva DECIMAL(15,5) = 0.00
			,@subTotalNetoIva DECIMAL(15,5) = 0.00 
			,@subTotalIvaCero DECIMAL(15,5) = 0.00
			,@subTotalNetoIvaCero DECIMAL(15,5) = 0.00
			,@subTotalNoObjetoIva DECIMAL(15,5) = 0.00
			,@subTotalNetoNoObjetoIva DECIMAL(15,5) = 0.00
			,@subTotalExentoIva DECIMAL(15,5) = 0.00
			,@subTotalNetoExentoIva DECIMAL(15,5) = 0.00
			,@totalIce DECIMAL(15,5) = 0.00
			,@irbpnr DECIMAL(15,5) = 0.00
			,@iva DECIMAL(15,5)= 0.00

			--SELECT @subTotalIva = (CASE WHEN codigo = 2 THEN SUM(valor) END)
			--,@subTotalNetoIva = 

			--FROM Recepcion.CompImp_Imp_Temp cd
			--WHERE cd.idDocumento = @idDocumento
			
			 
			INSERT INTO FacturaCompra 
				(idTipoDocumento,idEstadoPago,idSustentoTributario,idProveedor,codEstab
				,idCategoriaCompra,idTiempoCredito,nroDocumento,puntoEmision,nroAutorizacion
				,fechaEmision,fechaVencimiento,subTotalSinImpuestos,subTotalIva,subTotalNetoIva
				,subTotalIvaCero,subTotalNetoIvaCero,subTotalNoObjetoIva,subTotalNetoNoObjetoIva
				,subTotalExentoIva,subTotalNetoExentoIva,totalDescuento,porcentajeDescuento
				,totalIce,irbpnr,propina,iva,recargo,transporte,total,observacion,retencion
				,fechaRegistro,idUsuario,idEntidad,estab)

			SELECT 1, @idEstadoPago, idSustentoTributario, idProveedor, @codEstab
			,idCategoriaCompra, idTiempoCredito, secuencial, estab + '-' + ptoEmi, claveAcceso
			,fechaEmision, fechaEmision, totalSinImpuestos, @subTotalIva,@subTotalNetoIva
			,@subTotalIvaCero, @subTotalNetoIvaCero, @subTotalNoObjetoIva, @subTotalNetoNoObjetoIva
			,@subTotalExentoIva, @subTotalNetoExentoIva, totalDescuento, 0.00
			,@totalIce, @irbpnr, propina, @iva, 0.00, 0.00, importeTotal, observacion, 0.00
			,GETDATE(), @idUsuario, @idEntidad, estab FROM @tmp
			
			SET @idFacturaCompra = @@IDENTITY

			----REGISTRO DEL DETALLE DEL DOCUMENTO 
			INSERT INTO FacturaCompraDetalle
			   (idFacturaCompra, idBodega, idArticulo, idMedida, descripcion,
				cantidad, precioCosto, precioCostoNeto, valorDescuento,
				nota, total)

			SELECT @idFacturaCompra, @idBodega, cd.idArticulo, idMedida, descripcion,
			cantidad, precioUnitario, CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5)), cd.descuento
			,''
			,(SELECT SUM(cast(ct.baseImponible as numeric(18,2))) FROM Recepcion.Doc_Impuesto_Temp ct WITH(NOLOCK)
																	WHERE ct.idDocumento = cd.idDocumento
																	AND ct.codArticulo = cd.codigoPrincipal
																	AND ct.idDetalle = cd.idDetalle)
			--AND cd.codigoPrincipal = ct.codArticulo)

			FROM Recepcion.Doc_Detalle_Temp cd
			--LEFT JOIN Recepcion.Doc_Impuesto_Temp ct ON cd.idDocumento = ct.idDocumento
			--AND cd.codigoPrincipal = ct.codArticulo
			WHERE cd.idDocumento = @idDocumento
			--GROUP BY cd.idArticulo, cd.idMedida, cd.descripcion, cd.cantidad, cd.precioTotalSinImpuesto
			--, cd.precioUnitario, cd.descuento

			INSERT INTO Compra.FacturaCompraImpuesto(idFac_CompraDetalle, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
			SELECT fcd.idFacturaCompraDetalle, i.codigo, i.codigoPorcentaje, i.tarifa, i.baseImponible, i.valor
			FROM Recepcion.Doc_Impuesto_Temp i
			INNER JOIN Recepcion.Doc_Detalle_Temp cd on i.idDocumento = cd.idDocumento
			AND i.codArticulo = cd.codigoPrincipal
			INNER JOIN FacturaCompraDetalle fcd ON cd.idArticulo = fcd.idArticulo
			AND fcd.idFacturaCompra = @idFacturaCompra
			WHERE i.idDocumento = @idDocumento


			IF (SELECT LTRIM(RTRIM(payments)) FROM @tmp) IS NULL OR (SELECT LTRIM(RTRIM(payments)) FROM @tmp) = '' OR (SELECT LTRIM(RTRIM(payments)) FROM @tmp) = 'null'
				BEGIN
						INSERT INTO Compra.FormaPago(idDocumento, codDoc, formaPago, total) 
						SELECT @idFacturaCompra, '01', '20', (select top 1 importeTotal from @tmp)
				END
			ELSE
				BEGIN
						INSERT INTO Compra.FormaPago(idDocumento, codDoc, formaPago, total) 
						SELECT @idFacturaCompra, '01', FormaPago, total FROM OPENJSON((SELECT payments FROM @tmp)) WITH (formaPago VARCHAR(2)'$.formaPago', total NUMERIC(18,2) '$.total')
				END

			DECLARE @idTiempoCredito INT
			,@total DECIMAL(15,5)
			,@fechaEmision VARCHAR(10)

			SELECT @idTiempoCredito = idTiempoCredito, @total = importeTotal, @fechaEmision = fechaEmision FROM @tmp

			INSERT INTO CuotaXPagar 
				(idTipoDocumento
				,idComprobante
				,idEstadoPago
				,fechaVencimiento
				,nroCuota
				,cuota 
				,entrada
				,idUsuario
				,fechaRegistro)
			SELECT 
				 1
				,@idFacturaCompra
				,@idEstadoPago
				,fechaVencimiento
				,nroCuota
				,cuota
				,entrada
				,@idUsuario
				,dbo.ufnGetDateEcuador()
			FROM AFTCuotasDocumentos(@idTiempoCredito,@total,@fechaEmision)


			--delete temp detail
			DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = @idDocumento
			DELETE FROM Recepcion.Doc_Impuesto_Temp WHERE idDocumento = @idDocumento
			--update main table importacion

			UPDATE Recepcion.DocumentoRecibido SET complete = 1 WHERE idDocumento = @idDocumento

			UPDATE fcd SET
				 fcd.idTipoIva = ti.idTipoIva
				,fcd.porcentajeIva = ti.porcentaje
				,fcd.porcentajeDescuento = 0
				,iva = fi.valor
			FROM dbo.FacturaCompraDetalle fcd 
			INNER JOIN Compra.FacturaCompraImpuesto fi ON fi.idFac_CompraDetalle = fcd.idFacturaCompraDetalle
			INNER JOIN dbo.TipoIva ti ON ti.codigoPorcentaje = fi.codigoPorcentaje
			WHERE fcd.idFacturaCompra = @idFacturaCompra

			--EXEC ASPStockUpdate @idFacturaCompra,@idTipoDocumento

			SELECT '1' AS code, 'Registrada exitosamente' AS 'message'
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH 
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), '', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
			
	END CATCH 
END
