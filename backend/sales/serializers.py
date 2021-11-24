from typing import Dict
from rest_framework.serializers import ModelSerializer, ValidationError
from products.models import Products
from .models import Sales, Invoices


class InvoicesSerializer(ModelSerializer):

    class Meta:
        model = Invoices
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "taxes": {"read_only": True},
            "gross_total": {"read_only": True},
            "net_total": {"read_only": True},
            "emitted_at": {"read_only": True},
        }


class SalesSerializer(ModelSerializer):
    
    class Meta:
        model = Sales
        fields= "__all__"
        extra_kwargs = {
            "purchase_date": {"read_only": True}
        }

    def validate_product_id(self, value):

        # Validating if the id was set
        if not value:
            raise ValidationError(detail="Product id was not informed")
        return value

    def create(self, validated_data: Dict):
        """
        Here we are overriding the create() method for this SalesSerializer class, because we need to specify which instance of
        products is that we are saving into the database. So, here, in the "product_id" key, value pair, we specify that it's 
        value will now be a instance of products with the given id.
        """
        # validated_data["product_id"] = Products.objects.get(pk=validated_data.get("product_id"))
        return super(SalesSerializer, self).create(validated_data)
