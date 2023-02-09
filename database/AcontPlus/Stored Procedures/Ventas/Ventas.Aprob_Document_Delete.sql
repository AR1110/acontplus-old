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
IF OBJECT_ID(N'Ventas.Aprob_Document_Delete', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Delete 
GO
CREATE PROCEDURE Ventas.Aprob_Document_Delete @idRol INT, @id INT
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
		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

		SELECT @docOrigen = docOrigen,@uniqueId = uniqueId FROM Ventas.Aprob_Document WHERE idAprob_Document = @id

		SELECT @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WHERE codigo = 'PE'

		BEGIN TRAN 
			
			INSERT INTO Ventas.Aprob_Document_Anul(uniqueId,idUsuario,fechaRegistro)
			SELECT @uniqueId,@idUsuario,dbo.ufnGetDateEcuador()

			UPDATE Ventas.Aprob_Document SET codEstado = @codEstado WHERE idAprob_Document = @id

			IF @docOrigen = 'NE'
				BEGIN
					UPDATE ne SET ne.idEstadoPago = @idEstadoDocumento
					FROM dbo.NotaEntrega ne WITH(NOLOCK)
				    JOIN (SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt WHERE dt.uniqueId = @uniqueId) dt ON dt.idDocumento = ne.idNotaEntrega
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
