USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-26
-- Description:	SP for update orders details
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.OrderDetail_Update @userRoleId INT
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON; 
    DECLARE @tblDetails AS TABLE (
        id INT NOT NULL,
        obs VARCHAR(300) NOT NULL
    )
    DECLARE @userId INT
	BEGIN TRY
        INSERT INTO @tblDetails(id, obs)
        SELECT id, obs FROM OPENJSON(@json) WITH (id INT, obs VARCHAR(300))
		SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        BEGIN TRAN
			UPDATE od SET 
                od.Obs = td.obs,
                od.UpdatedAt = dbo.ufnGetDateEcuador(),
                od.UserId = @userId
            FROM TechnicalSupport.OrderDetail od WITH (ROWLOCK) 
                INNER JOIN @tblDetails td ON od.Id = td.id
		COMMIT TRAN
        SELECT '1' code, 'Actualizado correctamente' as 'message'
	END TRY
	BEGIN CATCH
		 SELECT '0' code, 'Error al guardar la orden' as 'message'
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'TechSupport/OrderDetail/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END
GO