CREATE OR ALTER FUNCTION dbo.ufn_spresponse
(
    @code VARCHAR(1),
    @message VARCHAR(300),
    @payload NVARCHAR(MAX) = NULL
)
RETURNS VARCHAR(200)
AS
BEGIN
    DECLARE @result VARCHAR(200)
    SET @result = (SELECT code = @code, [message] = @message, payload = ISNULL(@payload, '')
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
    RETURN @result
END;
