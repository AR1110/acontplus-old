CREATE OR ALTER FUNCTION Common.ExtractUpperCase (@Input VARCHAR(255))
RETURNS VARCHAR(255)
AS
BEGIN
    DECLARE @Position INT = 1
    DECLARE @Length INT = LEN(@Input)
    DECLARE @Result VARCHAR(255) = ''
    DECLARE @CurrentChar CHAR(1)

    WHILE @Position <= @Length
    BEGIN
        -- Extract a single character
        SET @CurrentChar = SUBSTRING(@Input, @Position, 1)
        -- Check if the character is an uppercase letter
        IF @CurrentChar COLLATE Latin1_General_BIN LIKE '[A-Z]'
            SET @Result = @Result + @CurrentChar
        SET @Position = @Position + 1
    END

    RETURN @Result
END
