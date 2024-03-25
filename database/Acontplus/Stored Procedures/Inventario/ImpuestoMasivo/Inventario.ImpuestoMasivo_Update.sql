USE AcontPlus
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
-- Author:		Ivan Paz
-- Create date: 2023-05-16
-- Description:	SP FOR UPDATE ALL PRICES OF ARTICLES
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.ImpuestoMasivo_Update @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Variables Globales
	DECLARE @idUsuario INT, @idEntidad INT

    --> Dato json
    DECLARE @taxIdFrom INT, @taxIdTo INT
	       
    DECLARE @tbImpuesto AS TABLE 
    (
        taxIdFrom INT NOT NULL
       ,taxIdTo INT NOT NULL
       ,Quantity INT NOT NULL
       ,Module VARCHAR(150) NOT NULL DEFAULT '/Inventario/ImpuestoMasivo'
       ,[Action] VARCHAR(150) NOT NULL DEFAULT 'Update'
       ,CreateAt DATETIME2 NOT NULL DEFAULT GETDATE()
       ,Obs VARCHAR(200) NOT NULL
    )

    

	BEGIN TRY
        
        --> Informacion General
	    SELECT TOP 1 @idUsuario = idUsuario , @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json
        INSERT INTO @tbImpuesto
              (taxIdFrom,taxIdTo,Quantity,Obs)
        SELECT taxIdFrom,taxIdTo,quantity,obs 
        FROM OPENJSON(@json) WITH 
        (
             taxIdFrom INT
            ,taxIdTo   INT
            ,quantity  INT
            ,obs       VARCHAR(200)
        )

        --> Validacion de informacion
        IF (SELECT COUNT(*) FROM @tbImpuesto) = 0
            BEGIN
                SELECT [Common].[ufnSpResponse]('1','Error en la informacion de json', DEFAULT)
                RETURN
            END 

        --> recuperar informacion variables
        SELECT TOP 1 @taxIdFrom = taxIdFrom, @taxIdTo = taxIdTo FROM @tbImpuesto

		BEGIN TRAN
		    
            UPDATE dbo.Articulo WITH (ROWLOCK)
                SET idTipoIva = @taxIdTo
            WHERE idEntidad = @idEntidad
              AND estado = 1 
              AND idTipoIva = @taxIdFrom

            INSERT INTO Seguridad.TransactionHistory
                   (UserRoleId,Quantity,Module,[Action],Obs,CreateAt)
            SELECT @userRoleId,Quantity,Module,[Action],Obs,CreateAt FROM @tbImpuesto

		COMMIT TRAN
        SELECT [Common].[ufnSpResponse]('1','Actualización exitosa', DEFAULT)
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
            BEGIN 
			    ROLLBACK TRAN
            END 
		
        INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'ImpuestoMasivo/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	    
        SELECT [Common].[ufnSpResponse]('0','Error en el procedimiento', DEFAULT)
    END CATCH
END
GO
