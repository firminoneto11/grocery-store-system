from django.db import models


class Products(models.Model):

    # Required fields
    name = models.CharField(unique=True, null=False, blank=False, max_length=100, error_messages={
        "unique": "A product with the given name already exists in the database."
    })
    unity_price = models.DecimalField(max_digits=8, decimal_places=2, blank=False, null=False)
    suppliers_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=False, blank=False)
    freight_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=False, blank=False)

    # Optional fields
    description = models.TextField(blank=True, null=True, default="")
    amount_in_stock = models.IntegerField(null=False, blank=False, default=0)
    is_active = models.BooleanField(null=False, blank=False, default=True)

    # Auto generated fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} | {self.amount_in_stock}x | R${self.unity_price}"

    class Meta:
        db_table = "PRODUCTS"
        ordering = ("id", )
