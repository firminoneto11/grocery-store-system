
-- By default, in the sqlite database, the trigger is triggered for each row affected
CREATE TRIGGER update_product_date_on_sale_save
    AFTER UPDATE ON PRODUCTS
    WHEN old.amount_in_stock <> new.amount_in_stock
    BEGIN
        UPDATE PRODUCTS SET updated_at = datetime('NOW') WHERE id = new.id;
    END;
