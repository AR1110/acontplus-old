USE AcontPlus
GO
CREATE FUNCTION fnIsValidEmail
(
    @email varchar(255)
)
RETURNS bit
AS
BEGIN

    DECLARE @IsValidEmail bit = 0

    IF (@email not like '%[^a-z,0-9,@,.,!,#,$,%%,&,'',*,+,--,/,=,?,^,_,`,{,|,},~]%' --First Carat ^ means Not these characters in the LIKE clause. The list is the valid email characters.
        AND @email like '%_@_%_.[a-z,0-9][a-z]%'
        AND @email NOT like '%@%@%'  
        AND @email NOT like '%..%'
        AND @email NOT like '.%'
        AND @email NOT like '%.'
        AND CHARINDEX('@', @email) <= 65
        )
    BEGIN
        SET @IsValidEmail = 1
    END

    RETURN @IsValidEmail

END