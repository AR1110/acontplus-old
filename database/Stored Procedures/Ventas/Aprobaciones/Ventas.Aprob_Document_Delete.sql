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
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Delete @idUsuarioRol INT, @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEstadoDocumento INT
	DECLARE @idUsuario INT
	DECLARE @codEstado VARCHAR(5) = 'A'
	DECLARE @docOrigen VARCHAR(5) 
	DECLARE @uniqueId VARCHAR(150)

	BEGIN TRY 
		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

		SELECT @docOrigen = docOrigen,@uniqueId = uniqueId FROM Ventas.Aprob_Document WHERE idAprob_Document = @id

		SELECT @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WHERE codigo = 'PE'

		BEGIN TRAN 
			
			INSERT INTO Ventas.Aprob_Document_Anul(uniqueId,idUsuario,fechaRegistro)
			SELECT @uniqueId,@idUsuario,dbo.ufnGetDateEcuador()

			UPDATE Ventas.Aprob_Document SET codEstado = @codEstado WHERE idAprob_Document = @id
			
			UPDATE infoAdd  SET estado = 1
			FROM Compra.InfoAdicional infoAdd
			INNER JOIN Ventas.HistoryInfoAdicional h WITH(NOLOCK) ON h.idInfoAdicional = infoAdd.idInfoAdicional
			WHERE h.codDoc ='APR' AND h.idDocumento = @id

			IF @docOrigen = 'NE'
				BEGIN
					
					DECLARE @idDocumento AS INT

					DECLARE cursor_inventory CURSOR LOCAL FOR
					SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt
				    WHERE dt.uniqueId = @uniqueId

					
					UPDATE cc SET cc.idEstadoPago = @idEstadoDocumento FROM Contabilidad.CuentaPorCobrar cc WITH(NOLOCK)
				    JOIN (SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt WHERE dt.uniqueId = @uniqueId) dt ON dt.idDocumento = cc.idDocumento AND cc.codDoc = 'NE'


					OPEN cursor_inventory

						FETCH NEXT FROM cursor_inventory INTO @idDocumento

						WHILE @@FETCH_STATUS = 0
							BEGIN
								--tipo transaccion  salidas
								--tipo documento  NotaEntrega
								EXEC Inventario.Transaccion_Update 'S','NE',@idDocumento,1
								FETCH NEXT FROM cursor_inventory INTO @idDocumento
							END
					CLOSE cursor_inventory
					DEALLOCATE cursor_inventory 

				END 

			IF @docOrigen = 'PR'
				BEGIN
					UPDATE pr SET pr.idEstadoDocumento = @idEstadoDocumento
					FROM dbo.Proforma pr WITH(NOLOCK) 
					JOIN (SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt WHERE dt.uniqueId = @uniqueId) dt ON dt.idDocumento = pr.idProforma
				END 

		COMMIT TRAN 
		SELECT '1'code,'Anulado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH 
		SELECT '0' code,'Error en el procedimiento: '+ERROR_MESSAGE() as 'message'
		RETURN 
	END CATCH 

END
GO
