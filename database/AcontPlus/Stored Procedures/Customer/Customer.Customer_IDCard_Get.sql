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
-- Create date: 2023-07-05
-- Description:	sp for get 
-- =============================================
CREATE OR ALTER PROCEDURE Customer.Customer_IDCard_Get @id VARCHAR(25)
,@IDType VARCHAR(2) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	IF (LEN(@IDType) > 0 AND @IDType = '05')
		BEGIN
			SELECT IDCard identificacion, BusinessName nombreCompleto, ISNULL(TradeName, '') nombreComercial, ISNULL([Address], '') direccion,
                                ISNULL(telephone,'') telefono, ISNULL(email, '') email
                                FROM Customer.Customer 
								WHERE LTRIM(RTRIM(IDCard)) = LTRIM(RTRIM(@id))
								AND SriValidation = 1
			RETURN
		END

	SELECT IDCard numeroRuc, BusinessName razonSocial, ISNULL(TradeName, '') nombreComercial, ISNULL([Address], '') direccion,
                                ISNULL(telephone,'') telefono, ISNULL(email, '') email
                                FROM Customer.Customer 
								WHERE LTRIM(RTRIM(IDCard)) = LTRIM(RTRIM(@id))
								AND SriValidation = 1
END
GO
