from django.db import models
from products.models import Products


class Invoices(models.Model):

    # Required fields
    taxes = models.DecimalField(max_digits=8, decimal_places=2, blank=False, null=False)
    gross_total = models.DecimalField(max_digits=8, decimal_places=2, blank=False, null=False)
    net_total = models.DecimalField(max_digits=8, decimal_places=2, blank=False, null=False)

    # Auto generated fields
    emitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "INVOICES"
        ordering = ("id", )


class Sales(models.Model):

    # Foreign keys

    # Auto generated
    invoice_id = models.ForeignKey(to=Invoices, related_name="invoice", on_delete=models.SET_NULL, blank=False, null=True, 
        db_column="invoice_id")
    
    # Required
    product_id = models.ForeignKey(to=Products, related_name="product", on_delete=models.SET_NULL, blank=False, null=True,
        db_column="product_id")


    # Required Fields
    amount = models.IntegerField(null=False, blank=False)

    # Optional fields
    customers_name = models.CharField(max_length=50, blank=True, null=False)
    customers_cpf = models.CharField(max_length=14, blank=True, null=False)

    # Auto generated fields
    purchase_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "SALES"
        ordering = ("id", )
