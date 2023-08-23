CREATE OR ALTER FUNCTION dbo.ufn_spresponse
(
    @code VARCHAR(1),
    @message VARCHAR(300),
    @payload NVARCHAR(MAX) = NULL
)
RETURNS VARCHAR(MAX)
AS
BEGIN
    DECLARE @result VARCHAR(MAX)
    SET @result = (SELECT code = @code, [message] = @message, payload = ISNULL(@payload, '')
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
    RETURN @result
END;
