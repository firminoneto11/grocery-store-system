from django.db import models
from products.models import Products


class Invoices(models.Model):

    # Required fields
    taxes = models.DecimalField(max_digits=8, decimal_places=2, blank=False, null=False)
    gross_total = models.DecimalField(max_digits=8, decimal_places=2, blank=False, null=False)
    net_total = models.DecimalField(max_digits=8, decimal_places=2, blank=False, null=False)

    # Optional Fields
    customers_name = models.CharField(max_length=50, blank=True, null=False)
    customers_cpf = models.CharField(max_length=14, blank=True, null=False)

    # Auto generated fields
    emitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "INVOICES"
        ordering = ("-emitted_at", )


class Sales(models.Model):

    # Foreign keys
    # Auto generated
    invoice_id = models.ForeignKey(to=Invoices, related_name="invoice", blank=False, null=False, db_column="invoice_id", 
        on_delete=models.CASCADE)

    # Required
    product_id = models.ForeignKey(to=Products, related_name="product", on_delete=models.SET_NULL, blank=False, null=True,
        db_column="product_id")

    # Required Fields
    amount = models.IntegerField(null=False, blank=False)

    class Meta:
        db_table = "SALES"
        ordering = ("id", )
