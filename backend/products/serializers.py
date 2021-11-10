from .models import Products
from rest_framework.serializers import ModelSerializer, ValidationError


class ProductsSerializer(ModelSerializer):

    class Meta:
        model = Products
        fields = ("id", "created_at", "updated_at", "is_active", "amount_in_stock", "description", "name", 
        "unity_price", "suppliers_percentage", "freight_percentage")

        extra_fields = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def validate_suppliers_percentage(self, value):
        value = float(value)
        if value and (value > 0 and value < 100):
            return value
        elif value and (value < 0 or value > 100):
            raise ValidationError(detail="The supplier's percentage must be a value beetwen 0 and 100.")

    def validate_freight_percentage(self, value):
        value = float(value)
        if value and (value > 0 and value < 100):
            return value
        elif value and (value < 0 or value > 100):
            raise ValidationError(detail="The freight's percentage must be a value beetwen 0 and 100.")
