
DELETE FROM SALES;
DELETE FROM INVOICES;
UPDATE sqlite_sequence SET seq = 0 WHERE NAME = 'SALES';
UPDATE sqlite_sequence SET seq = 0 WHERE NAME = 'INVOICES';
