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
CREATE OR ALTER PROCEDURE Compra.Proveedor_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
	
    --> Global
    DECLARE @idUsuario INT
    
    --> Proveedor
    DECLARE @nombreFiscal VARCHAR(100) ,@nombreComercial VARCHAR(100) ,@direccion VARCHAR (100),@telefono VARCHAR(300)
	       ,@correo VARCHAR(90) ,@idTipoClienteProveedor INT ,@idTipoEntidad INT ,@idCiudad INT ,@idSubContribuyente INT 
	       ,@idTiempoCredito INT ,@estado BIT ,@validationSri BIT

	BEGIN TRY 
        
        SELECT @idCiudad               = idCiudad
              ,@idTipoClienteProveedor = idTipoClienteProveedor
              ,@idTipoEntidad          = idTipoEntidad
              ,@idSubContribuyente     = idSubContribuyente
              ,@idTiempoCredito        = idTiempoCredito
              ,@nombreFiscal           = nombreFiscal
              ,@nombreComercial        = nombreComercial
              ,@direccion              = direccion
              ,@telefono               = telefono
              ,@correo                 = correo
              ,@validationSri          = validationSri
              ,@estado                 = estado
        FROM OPENJSON(@json) WITH
        (
             idCiudad                     INT '$.idCiudad'
            ,idTipoClienteProveedor       INT '$.idTipoClienteProveedor'
            ,idTipoEntidad                INT '$.idTipoEntidad'
            ,idSubContribuyente           INT '$.idSubContribuyente' 
            ,idTiempoCredito              INT '$.idTiempoCredito'
            ,nombreFiscal        VARCHAR(300) '$.nombreFiscal' 
            ,nombreComercial     VARCHAR(300) '$.nombreComercial' 
            ,direccion           VARCHAR(300) '$.direccion' 
            ,telefono            VARCHAR(300) '$.telefono' 
            ,correo              VARCHAR(300) '$.correo' 
            ,validationSri                BIT '$.validationSri'
            ,estado                       BIT '$.estado'
        )

		BEGIN TRAN 
			UPDATE Proveedor SET 
				 idCiudad               = @idCiudad
				,nombreFiscal           = LTRIM(RTRIM(@nombreFiscal))
				,nombreComercial        = LTRIM(RTRIM(@nombreComercial))
				,direccion              = @direccion
				,telefono               = @telefono
				,correo                 = @correo
				,idTipoClienteProveedor = @idTipoClienteProveedor
				,idTipoEntidad          = @idTipoEntidad
				,idSubContribuyente     = @idSubContribuyente
				,idTiempoCredito        = @idTiempoCredito
				,estado                 = @estado
				,validationSri          = @validationSri
			WHERE idProveedor = @id 

		COMMIT TRAN 
		SELECT Common.ufnSpResponse('1','Actualizado Exitosamente',NULL)
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN ;
		END 
		SELECT Common.ufnSpResponse('0','Info: Error en el procedimiento', NULL)
		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Proveedor/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	END CATCH 

END
