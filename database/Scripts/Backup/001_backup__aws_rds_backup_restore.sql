-- AWS RDS Backup and Restore Commands
-- S3 Bucket Naming Convention: acontplus-{env}-str-{purpose}-s3
-- See docs/AWS-Naming-Convention.md for full reference

--use master
--go

--create database Acontplus

-- BACKUP TO S3
--EXEC [msdb].[dbo].[rds_backup_database]
--@source_db_name='Acontplus',
--@s3_arn_to_backup_to = N'arn:aws:s3:::acontplus-prd-str-backups-s3/mssql/acontplus_bk_2023-08-01.bak'

-- RESTORE FROM S3
-- exec msdb.dbo.rds_restore_database
--    @restore_db_name='Acontplus',
--    @s3_arn_to_restore_from= N'arn:aws:s3:::acontplus-prd-str-backups-s3/mssql/acontplus_2023_08_18.bak',
--    @type = 'FULL'

--EXEC [msdb].[dbo].[rds_task_status]


--exec msdb.dbo.rds_backup_database
--	@source_db_name='Acontplus',
--	@s3_arn_to_backup_to='arn:aws:s3:::acontplus-prd-str-backups-s3/mssql/acontplus_2023_08_17.bak',
--	--[@kms_master_key_arn='arn:aws:kms:r:account-id:key/key-id'],
--	--[@overwrite_s3_backup_file=0|1],
--	@type='FULL'
--	--[@number_of_files=n];

--	EXEC [msdb].[dbo].[rds_task_status]
