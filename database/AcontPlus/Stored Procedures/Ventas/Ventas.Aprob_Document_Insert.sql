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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Ventas.Aprob_Document_Insert', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Insert 
GO
CREATE PROCEDURE Ventas.Aprob_Document_Insert 
	@idRol INT 
   ,@jsonHeader	 VARCHAR(MAX)
   ,@jsonDetail	 VARCHAR(MAX)
   ,@jsonHistory VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idEntidad INT 
	DECLARE @idUsuario INT
	DECLARE @idPuntoEmision INT
	DECLARE @uniqueId VARCHAR(150) = NEWID()
	DECLARE @docOrigen VARCHAR(5)
	DECLARE @idEstadoDocumento INT
	DECLARE @codigoPorcentaje INT 

    DECLARE @fechaEmision DATETIME
	DECLARE @identificacionComprador VARCHAR(20)
    DECLARE @codDoc VARCHAR(5) = '01'
    DECLARE @estab VARCHAR(5)
    DECLARE @ptoEmi VARCHAR(5)
    DECLARE @ruc VARCHAR(20)
    DECLARE @ambiente VARCHAR(5)
    DECLARE @tipoEmision VARCHAR(5) = '1'
    DECLARE @secuencial INT
    DECLARE @claveAcceso VARCHAR(50)

	BEGIN TRY 
		SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

		SELECT @ruc = ruc FROM dbo.Entidad WHERE idEntidad = @idEntidad

		SELECT @codigoPorcentaje = codigoPorcentaje FROM Config.GestionSistema WHERE idEntidad = @idEntidad

		SELECT @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WHERE codigo = 'APL'

		SELECT @docOrigen = docOrigen FROM OPENJSON(@jsonHeader) WITH (docOrigen VARCHAR(5) '$.docOrigen')

		SELECT	
			@idPuntoEmision          = dt.idPuntoEmision 
		   ,@identificacionComprador = numeroIdentificacion
		   ,@estab                   = s.estab
		   ,@ptoEmi                  = pto.ptoEmi
		   ,@ambiente                = pto.ambiente
		   ,@fechaEmision            = dt.fechaEmision
		FROM Helper.F_DeserializeDocument_header(@jsonHeader) dt 
		INNER JOIN dbo.PuntoEmision  pto ON pto.idPuntoEmision = dt.idPuntoEmision
		INNER JOIN Sri.Establecimiento s ON s.codEstab         = pto.codEstab
		INNER JOIN dbo.Cliente        cl ON cl.idCliente       = dt.idCliente 

		SELECT @secuencial =  COUNT(*)+1 FROM Ventas.Aprob_Document WHERE idPuntoEmision = @idPuntoEmision

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,@codDoc
													   ,@ambiente
													   ,@tipoEmision
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))
		IF @claveAcceso IS NULL
			BEGIN
				SELECT '0'code,'Error critico la clave de Acceso no se genero correctamente' as 'message'
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM Ventas.Aprob_Document wHERE claveAcceso = @claveAcceso)
			BEGIN
				SELECT '0'code,'Esta clave de acceso ya se encuentra registrada' as 'message'
				RETURN
			END 

		BEGIN TRAN
			INSERT INTO Ventas.Aprob_Document(
				uniqueId
			   ,idCliente
			   ,idPuntoEmision
			   ,fechaEmision
			   ,identificacionComprador
			   ,codDoc
			   ,estab
			   ,ptoEmi
			   ,ruc
			   ,ambiente
			   ,tipoEmision
			   ,secuencial
			   ,claveAcceso
			   ,totalSinImpuestos
			   ,totalDescuento
			   ,totalConImpuestos
			   ,propina
			   ,importeTotal
			   ,codigoPorcentaje
			   ,docOrigen
			   ,observacion
			   ,idEntidad
			   ,idUsuario
			)
			SELECT 
				@uniqueId
			   ,idCliente
			   ,idPuntoEmision
			   ,@fechaEmision
			   ,@identificacionComprador
			   ,@codDoc
			   ,@estab
			   ,@ptoEmi
			   ,@ruc
			   ,@ambiente
			   ,@tipoEmision
			   ,@secuencial
			   ,@claveAcceso
			   ,subTotalSinImpuestos
			   ,totalDescuento
			   ,total
			   ,propina
			   ,total
			   ,@codigoPorcentaje
			   ,@docOrigen
			   ,observacion
			   ,@idEntidad
			   ,@idUsuario
			FROM Helper.F_DeserializeDocument_header(@jsonHeader)

			INSERT INTO Ventas.Aprob_Document_Detailt(
				uniqueId
			   ,codArticulo
			   ,idTarifa
			   ,codMedida
			   ,codigoPrincipal
			   ,codigoAuxiliar
			   ,cantidad
			   ,descripcion
			   ,precioUnitario
			   ,descuento
			   ,precioTotalSinImpuesto
			   ,codigo
			   ,codigoPorcentaje
			   ,tarifa
			   ,baseImponible
			)
			SELECT 
			    @uniqueId
			   ,a.code_unique
			   ,dt.idTarifa
			   ,m.codigo
			   ,a.codigo
			   ,a.codigoAuxiliar
			   ,dt.cantidad
			   ,dt.descripcion
			   ,dt.precioUnitario
			   ,dt.valorDescuento
			   ,dt.precioTotalSinImpuesto
			   ,i.codigo
			   ,ti.codigoPorcentaje
			   ,ti.porcentaje
			   ,dt.precioTotalSinImpuesto
			FROM Helper.F_DeserializeDocument_Detail(@jsonDetail) dt
			LEFT JOIN dbo.Articulo a ON a.idArticulo = dt.idArticulo
			LEFT JOIN dbo.TipoIva ti ON ti.idTipoIva = dt.idTipoIva
			LEFT JOIN dbo.Impuesto i ON i.idImpuesto = ti.idImpuesto
			LEFT JOIN dbo.Medida   m ON m.idMedida   = dt.idMedida
			ORDER BY dt.orderIndex ASC

			INSERT INTO Ventas.Aprob_Document_Hist(
				uniqueId
			   ,idDocumento
			   ,codDocumento
			   ,serie
			)
			SELECT 
				@uniqueId
			   ,idDocumento
			   ,@docOrigen
			   ,serie
			FROM OPENJSON(@jsonHistory) 
			WITH (idDocumento INT '$.idDocumento' ,serie VARCHAR(30) '$.serie')

			IF @docOrigen = 'NE'
				BEGIN
					UPDATE ne SET	
						ne.idEstadoPago = @idEstadoDocumento
					FROM dbo.NotaEntrega ne WITH(NOLOCK)
				    JOIN (SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt
					       WHERE dt.uniqueId = @uniqueId) dt ON dt.idDocumento = ne.idNotaEntrega
				END 

			IF @docOrigen = 'PR'
				BEGIN
					UPDATE pr SET	
						pr.idEstadoDocumento = @idEstadoDocumento
					FROM dbo.Proforma pr WITH(NOLOCK)
				    JOIN (SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt
					       WHERE dt.uniqueId = @uniqueId) dt ON dt.idDocumento = pr.idProforma
				END 

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message'
			INSERT INTO ErroresSistema
					(token
					,method
					,errorNumber
					,errorSeverity 
					,errorState
					,errorProcedure
					,errorLine
					,errorMessage
					,errorDate
					,idUsuario)
			VALUES
					(NEWID()
					,'/Aprobacion/Insert'
					,ERROR_NUMBER()
					,ERROR_SEVERITY()
					,ERROR_STATE()
					,ERROR_PROCEDURE()
					,ERROR_LINE()
					,ERROR_MESSAGE()
					,GETDATE()
					,@idUsuario)
	END CATCH 

END
GO
