USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspArticuloFraccionadoInsert]    Script Date: 10/11/2022 10:05:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-07-12
-- Description:	SP para registrar Articulos Fraccionados
-- ============================================= OCEDURE Almacen.Fraccionado_Insert
GO
CREATE OR ALTER PROCEDURE Inventario.Fraccionado_Insert
	 @userRoleId int 
	,@json VARCHAR(MAX) 
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idArticuloFraccionado INT
	DECLARE @idEntidad INT  
	DECLARE @idUsuario INT 
	DECLARE @idMedidaArticulo INT 
	DECLARE @sequential INT 
	DECLARE @code VARCHAR(15)
	DECLARE @payload VARCHAR(MAX)

	DECLARE @idArticulo int
	DECLARE @idMedida int 
	DECLARE @conversion decimal (10,5)
	DECLARE @gestionVenta bit 
	DECLARE @precioCostoFraccionado decimal(10,5)
	DECLARE @pvps nvarchar(max)

	SELECT @sequential = COUNT(*)+1 FROM dbo.ArticuloFraccionado

	SET @code = ('F'+Helper.F_Auto_Sequential(@sequential))
	
	SELECT 
		@idArticulo  = idArticulo 
		,@idMedida = idMedida
		,@conversion = conversion 
		,@gestionVenta = gestionVenta  
		,@precioCostoFraccionado = precioCostoFraccionado
		,@pvps = pvps
	FROM OPENJSON(@json)
	WITH(
		idArticulo int
		,idMedida int 
		,conversion decimal (10,5)
		,gestionVenta bit 
		,precioCostoFraccionado decimal(10,5)
		,pvps nvarchar(max) AS JSON
	)
    
	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

	SELECT @idMedidaArticulo = idMedida FROM Articulo WHERE idArticulo = @idArticulo 

	IF @gestionVenta = 1
		BEGIN
			IF EXISTS(SELECT 1 FROM ArticuloFraccionado WHERE idArticulo= @idArticulo AND gestionVenta= 1 )
				BEGIN 
                     SELECT Common.ufnSpResponse('0', 'Solo puedes asignar una medida como predeterminada en ventas', NULL) 
					RETURN 
				END 
		END 

	IF @idMedida = @idMedidaArticulo
		BEGIN
            SELECT Common.ufnSpResponse('0', 'No puedes fraccionar aun articulo a su medida principal', NULL)  
			RETURN 
		END 

	IF EXISTS(SELECT 1 FROM ArticuloFraccionado WHERE idArticulo = @idArticulo AND idMedida = @idMedida)
		BEGIN
            SELECT Common.ufnSpResponse('0', 'El Articulo ya se encuentra fraccionado en esta medida', NULL)  
			RETURN 
		END 

	BEGIN TRY
		BEGIN TRAN 
			INSERT INTO ArticuloFraccionado 
					(idArticulo
					,idMedida
					,conversion
					,gestionVenta
					,precioCostoFraccionado
					,idUsuario
					,idEntidad)
				VALUES 
					(@idArticulo
					,@idMedida
					,LTRIM(RTRIM(@conversion))
					,@gestionVenta
					,@precioCostoFraccionado
					,@idUsuario
					,@idEntidad)
					 
			SET @idArticuloFraccionado = @@IDENTITY

			INSERT INTO ArticuloFraccionadoPvP
					(idArticuloFraccionado
					,idTarifa
					,precioVenta
					,precioConIva
					,porcentajeUtilidad)
			SELECT 
					 @idArticuloFraccionado
					,idTarifa
					,precioVenta
					,precioConIva
					,porcentajeUtilidad
			FROM OPENJSON(@pvps) 
			WITH (idTarifa int '$.idTarifa'
					,precioVenta decimal(10,5) '$.precioVenta'
					,precioConIva decimal(10,5) '$.precioConIva'
					,porcentajeUtilidad decimal(10,5) '$.porcentajeUtilidad') as jsonValues 

		COMMIT TRAN 
          SELECT Common.ufnSpResponse('1', 'Fracciondao Exitosamente', NULL)   
		RETURN;
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
         SELECT Common.ufnSpResponse('0', 'Info: Error en el procedimiento de agregar ' + ERROR_MESSAGE(), NULL)    
		RETURN
	END CATCH 
END
