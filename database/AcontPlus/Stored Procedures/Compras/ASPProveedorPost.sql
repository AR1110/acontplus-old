USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPProveedorPost]    Script Date: 04/14/2023 4:03:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-07-29
-- Description:	SP Para registrar los tipos de personas en el sistema 
-- Modifidied by: Emilio Senguana 
-- =============================================
ALTER PROCEDURE [dbo].[ASPProveedorPost]
	 @idRol int
	,@idTipoIdentificacion int 
	,@numeroIdentificacion nvarchar(15)
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
	,@validationSri BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE  @idPersona int 
	DECLARE @persona int 
	DECLARE @idUsuario int = (SELECT idUsuario FROM AFTDataRol(@idRol))
		   ,@idEntidad int = (SELECT idEntidad FROM AFTDataRol(@idRol))
		   ,@idProveedor INT

    IF EXISTS(SELECT 1 FROM Proveedor WHERE numeroIdentificacion = @numeroIdentificacion and idEntidad = @idEntidad)
		BEGIN
			SELECT '0','El Ruc: '+ @numeroIdentificacion+ 'ya se encuentra registrado','Proveedor'
			RETURN 
		END 
	
	BEGIN TRY 
		BEGIN TRAN
			DECLARE @IDType VARCHAR(2)
			,@customerId INT

			IF NOT EXISTS(SELECT 1 FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion)))
				BEGIN
					SET @IDType = (SELECT codigoSri FROM TipoIdentificacion t WHERE t.idTipoIdentificacion = @idTipoIdentificacion)

					INSERT INTO Customer.Customer(IDType, IDCard, BusinessName, TradeName, email, telephone, [Address], SriValidation)
					SELECT @IDType, LTRIM(RTRIM(@numeroIdentificacion)), LTRIM(RTRIM(@nombreFiscal)), LTRIM(RTRIM(@nombreComercial)),  LTRIM(RTRIM(@correo)), LTRIM(RTRIM(@telefono)), LTRIM(RTRIM(@direccion)), @validationSri

					SET @customerId = @@IDENTITY
				END
			ELSE
				BEGIN 
					SET @customerId = (SELECT ID FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion)))
				END

			

			INSERT INTO Proveedor 
					(idCiudad 
					,idTipoIdentificacion
					,idTipoClienteProveedor
					,idTipoEntidad
					,idSubContribuyente
					,idTiempoCredito
					,numeroIdentificacion
					,nombreFiscal
					,nombreComercial
					,direccion
					,telefono
					,correo
					,idEntidad
					,idUsuario
					,validationSri)
				VALUES 
					(CASE WHEN @idCiudad = 0 THEN NULL ELSE @idCiudad END
					,@idTipoIdentificacion
					,CASE WHEN @idTipoClienteProveedor = 0 THEN NULL ELSE @idTipoClienteProveedor END  
					,CASE WHEN @idTipoEntidad = 0 THEN NULL ELSE @idTipoEntidad END 
					,@idSubContribuyente
					,CASE WHEN @idTiempoCredito = 0 THEN NULL ELSE @idTiempoCredito END
					,@numeroIdentificacion
					,LTRIM(RTRIM(@nombreFiscal))
					,LTRIM(RTRIM(@nombreComercial))
					,CASE WHEN LTRIM(RTRIM(@direccion))= '' THEN NULL ELSE @direccion END 
					,CASE WHEN LTRIM(RTRIM(@telefono))= '' THEN NULL ELSE @telefono END 
					,CASE WHEN LTRIM(RTRIM(@correo))= '' THEN NULL ELSE @correo END
					,@idEntidad
					,@idUsuario
					,@validationSri)

		----- Set data idProveedor after of insert -----
		SET @idProveedor = @@IDENTITY


		UPDATE Proveedor SET CustomerId = @customerId WHERE idProveedor = @idProveedor

		COMMIT TRAN 

		SELECT '1', 'Registrado exitosamente','Proveedor', @idProveedor 
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN ;
		END 
		SELECT '0', 'error','Info: Error en el procedimiento de agregar ' + ERROR_MESSAGE(), 'Proveedor'
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
									,'/PersonaDao/CreatePersonaAsync'
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
