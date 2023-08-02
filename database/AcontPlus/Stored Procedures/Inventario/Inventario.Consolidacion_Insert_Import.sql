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
IF OBJECT_ID(N'Inventario.Consolidacion_Insert_Import', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Consolidacion_Insert_Import
GO
CREATE PROCEDURE Inventario.Consolidacion_Insert_Import
	@idPuntoEmision INT
   ,@idArticulo INT
   ,@idBodega INT 
   ,@idMedida INT
   ,@cantidad INT
   ,@descripcion VARCHAR(500)
   ,@precioCosto NUMERIC(18,5)
   ,@idUsuario INT
   ,@idEntidad INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @tipo INT = 1
	DECLARE @idConsolidacionInventario INT
	DECLARE @idTipoDocumento INT
	DECLARE @idEstadoDocumento INT
	DECLARE @secuencial INT 
	DECLARE @fecha DATETIME
	DECLARE @importeTotal NUMERIC(18,5)

	IF EXISTS (SELECT 1 FROM v_InventarioTransaccion WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idBodega = @idBodega AND estado = 1 AND codTransaccion = 'A')
		BEGIN
			
			SELECT '0' code, 'Ajuste Existeste!' as 'message'
			ROLLBACK TRAN
			RETURN

			SELECT TOP 1 @idConsolidacionInventario = idDocumento, @fecha = fechaRegistro
			FROM v_InventarioTransaccion WITH (NOLOCK) 
			WHERE idArticulo = @idArticulo
			  AND idBodega = @idBodega 
			  AND estado = 1 
			  AND codTransaccion = 'A' 
			
			ORDER BY fechaRegistro DESC
			
			IF (SELECT COUNT(*) FROM dbo.ConsolidacionInventarioDetalle WITH (NOLOCK) WHERE idConsolidacionInventario = @idConsolidacionInventario) < = 50 
				BEGIN 
					
					SELECT @importeTotal = ISNULL(SUM(precioCosto * cantidad),0) FROM dbo.ConsolidacionInventarioDetalle WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idBodega = @idBodega AND estado = 1
					INSERT INTO ConsolidacionInventarioDetalle
							(idConsolidacionInventario
							,idArticulo
							,idBodega
							,idMedida
							,cantidad
							,descripcion
							,precioCosto 
							,precioActual)
					 SELECT @idConsolidacionInventario
						   ,@idArticulo 
						   ,@idBodega
						   ,@idMedida
						   ,@cantidad
						   ,@descripcion
						   ,@precioCosto
						   ,@precioCosto

					EXEC Inventario.Transaccion_Insert 'A', 'CI', @fecha, @idConsolidacionInventario,  @idArticulo, @idBodega ,@idMedida,NULL,@cantidad,@precioCosto,@precioCosto,@importeTotal, @idUsuario
					
					UPDATE ci SET 
						ci.total = (SELECT ISNULL(SUM(precioCosto * cantidad),0) FROM ConsolidacionInventarioDetalle d WHERE d.idConsolidacionInventario = ci.idConsolidacionInventario)
					FROM ConsolidacionInventario ci WITH(NOLOCK)
					WHERE ci.idConsolidacionInventario = @idConsolidacionInventario

					SET @tipo = 2
				END 

		END 
	
	IF @tipo = 1
		BEGIN
			
			SELECT '0' code, 'Ajuste Nuevo!' as 'message'
			ROLLBACK TRAN
			RETURN

			SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'CIV'

			SELECT TOP 1 @secuencial = secuencial FROM v_ConfigDocumento WITH (NOLOCK) WHERE codDoc = 'CIV' AND idPuntoEmision = @idPuntoEmision

			INSERT INTO ConsolidacionInventario
				(idPuntoEmision 
				,nroDoc
				,idTipoDocumento
				,idEstadoDocumento
				,fechaEmision
				,idUsuario
				,idEntidad
				,observacion
				,total
				,fechaRegistro)
			SELECT 
				 @idPuntoEmision
				,@secuencial
				,@idTipoDocumento
				,@idEstadoDocumento
				,@fecha
				,@idUsuario
				,@idEntidad
				,'STOCK INICIAL'
				,@cantidad * @precioCosto
				,dbo.ufnGetDateEcuador()

			SET @idConsolidacionInventario = @@IDENTITY 

			INSERT INTO ConsolidacionInventarioDetalle
							(idConsolidacionInventario
							,idArticulo
							,idBodega
							,idMedida
							,cantidad
							,descripcion
							,precioCosto 
							,precioActual)
					 SELECT @idConsolidacionInventario
						   ,@idArticulo 
						   ,@idBodega
						   ,@idMedida
						   ,@cantidad
						   ,@descripcion
						   ,@precioCosto
						   ,@precioCosto

			UPDATE ConfigDocumento SET ultimaSecuencia = ultiamSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

			EXEC Inventario.Transaccion_Insert 'A', 'CI', @fecha, @idConsolidacionInventario,  @idArticulo, @idBodega ,@idMedida,NULL,@cantidad,@precioCosto,@precioCosto,@importeTotal, @idUsuario
		
			
		END 
END
GO
