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
-- Create date: 2023-07-0
-- Description:	sp for get clients to validate in SRI
-- =============================================
CREATE OR ALTER PROCEDURE Customer.Customer_Serv_Val_Update @businessName VARCHAR(300)
,@tradeName VARCHAR(300)
,@IDCard VARCHAR(15)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @IDType VARCHAR(2)
    ,@customerId INT

	BEGIN TRY
		BEGIN TRAN
			--IF NOT EXISTS(SELECT 1 FROM Customer.Customer WHERE IDCard = @IDCard)
			--	BEGIN
			--		SET @IDType = (SELECT CASE WHEN LEN(@IDCARD) = 13 THEN '04' WHEN LEN(@IDCARD) = 10 THEN '05'END) 
			--		INSERT INTO Customer.Customer(IDType, IDCard, BusinessName, TradeName, SriValidation)
			--		SELECT @IDType, LTRIM(RTRIM(@IDCard)), LTRIM(RTRIM(@businessName)), LTRIM(RTRIM(@tradeName)), 1
			--		SET @customerId = @@IDENTITY
			--	END
			--ELSE
			--	BEGIN
			--		UPDATE Customer.Customer SET SriValidation = 1, businessName = @businessName, tradeName = @tradeName 
			--		WHERE IDCard = @IDCard
			--		SET @customerId = (SELECT ID FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@IDCARD)))
			--	END

			--UPDATE Cliente SET nombreComercial = @tradeName, nombreFiscal = @businessName, validationSri = 1, customerId = @customerId
			--WHERE numeroIdentificacion = @IDCard AND validationSri = 0

			--UPDATE Proveedor SET nombreComercial = @tradeName, nombreFiscal = @businessName, validationSri = 1, customerId = @customerId
			--WHERE numeroIdentificacion = @IDCard AND validationSri = 0


			SET @customerId = (SELECT id FROM Customer.Customer where IDCard = @IDCard)
			
			IF EXISTS(SELECT 1 FROM Cliente WHERE CustomerId = @customerId AND LTRIM(RTRIM(nombreFiscal)) != LTRIM(RTRIM(@businessName)))
				BEGIN
					UPDATE Cliente SET nombreComercial = @tradeName, nombreFiscal = @businessName, validationSri = 1
					WHERE customerId = @customerId
				END

			IF EXISTS(SELECT 1 FROM Proveedor p WHERE CustomerId = @customerId AND LTRIM(RTRIM(nombreFiscal)) != LTRIM(RTRIM(@businessName)))
				BEGIN
					UPDATE Proveedor SET nombreComercial = @tradeName, nombreFiscal = @businessName, validationSri = 1
					WHERE customerId = @customerId
				END
			--IF EXISTS(SELECT 1 FROM Customer.Customer WHERE Id = @customerId)
			--	BEGIN
					UPDATE Customer.Customer SET tradeName = @tradeName, businessName = @businessName, updatedAt = GETDATE(), BusinessNameUpdated = 1, SriValidation = 1
					WHERE Id = @customerId
				--END
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
		INSERT INTO ErroresSistema
								   (token
								   ,method
								   ,errorNumber
								   ,errorSeverity 
								   ,errorState
								   ,errorProcedure
								   ,errorLine
								   ,errorMessage
								   ,errorDate)
							VALUES
									(NEWID()
									,'/ServiceValSriCustomer'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE())
	END CATCH
	END
GO


--Customer.Customer_Serv_Val_Get 20