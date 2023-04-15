USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPProveedorUpdate]    Script Date: 04/14/2023 4:10:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-07-30
-- Description:	SP para acutualizar los datos de la persona 
-- =============================================
ALTER PROCEDURE [dbo].[ASPProveedorUpdate]
	 @idRol int
    ,@idProveedor int 
	,@nombreFiscal nvarchar(100)
	,@nombreComercial nvarchar(100)
	,@direccion nvarchar (100)
	,@telefono nvarchar(300)
	,@correo nvarchar(90)
	,@idTipoClienteProveedor int 
	,@idTipoEntidad int 
	,@idCiudad int 
	,@idSubContribuyente int 
	,@idTiempoCredito int
	,@estado bit 
	,@validationSri BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
	DECLARE @idEntidad int =(SELECT idEntidad FROM Rol WHERE idRol = @idRol)

	

	BEGIN TRY 
		BEGIN TRAN 

			UPDATE Proveedor SET 
				 idCiudad= CASE WHEN @idCiudad = 0 THEN NULL ELSE @idCiudad END
				,nombreFiscal=  LTRIM(RTRIM(@nombreFiscal))
				,nombreComercial = LTRIM(RTRIM(@nombreComercial))
				,direccion = CASE WHEN LTRIM(RTRIM(@direccion))= 'S/A' THEN NULL ELSE @direccion END 
				,telefono = CASE WHEN LTRIM(RTRIM(@telefono))= 'S/A' THEN NULL ELSE @telefono END 
				,correo = CASE WHEN LTRIM(RTRIM(@correo))= 'S/A' THEN NULL ELSE @correo END
				,idTipoClienteProveedor = CASE WHEN @idTipoClienteProveedor = 0 THEN NULL ELSE @idTipoClienteProveedor END  
				,idTipoEntidad = CASE WHEN @idTipoEntidad = 0 THEN NULL ELSE @idTipoEntidad END 
				,idSubContribuyente = @idSubContribuyente
				,idTiempoCredito = CASE WHEN @idTiempoCredito = 0 THEN NULL ELSE @idTiempoCredito END 
				,estado = @estado
				,validationSri = @validationSri
			WHERE idProveedor = @idProveedor 

		COMMIT TRAN 
		SELECT '1','success','Actualizado Correctamente!','Provedor'
		RETURN 
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN ;
		END 
		SELECT '0', 'error','Info: Error en el procedimiento de actualizar ' + ERROR_MESSAGE(), 'Persona - Proveedor'
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
									,'/PersonaDao/UpdatePersonaProveedorAsync'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE(), 
									1)
	END CATCH 

END
