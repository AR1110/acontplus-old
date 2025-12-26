-- (Optional) Shows the current value before changing it.
-- EXEC sp_configure 'max server memory (MB)';
-- GO

-- Enables advanced options to be changed.
EXEC sp_configure 'show advanced options', 1;
GO
RECONFIGURE;
GO

-- Sets the max server memory to 24 GB (24 * 1024 MB).
-- Adjust this value if needed.
EXEC sp_configure 'max server memory (MB)', 24576;
GO
RECONFIGURE;
GO

-- (Recommended) Verify the new setting has been applied.
EXEC sp_configure 'max server memory (MB)';
GO