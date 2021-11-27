
SELECT S.id as "ID da Venda", I.id as "ID da nota fiscal", P.* FROM PRODUCTS AS "P"
INNER JOIN SALES AS "S" ON (P.id = S.product_id)
INNER JOIN INVOICES AS "I" ON (S.invoice_id = I.id)
WHERE I.id = 3;
