from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Sales, Invoices


class InvoicesSerializer(ModelSerializer):

    class Meta:
        model = Invoices
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "taxes": {"read_only": True},
            "gross_total": {"read_only": True},
            "customers_name": {"read_only": True},
            "customers_cpf": {"read_only": True},
            "net_total": {"read_only": True},
            "emitted_at": {"read_only": True},
        }


class SalesSerializer(ModelSerializer):
    
    class Meta:
        model = Sales
        fields= "__all__"

    def validate_product_id(self, value):
        if not value:
            raise ValidationError(detail={"detail": "Product id was not informed"})
        return value

    def validate_amount(self, value):
        if not value:
            raise ValidationError(detail={"detail": "Purchase amount was not set"})
        elif value <= 0:
            raise ValidationError(detail={"detail": "Purchase amount can't be less or equal to 0"})
        return value
