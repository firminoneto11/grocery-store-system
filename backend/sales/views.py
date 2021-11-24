from rest_framework.response import Response as res
from rest_framework.request import Request
from utils import Gen
from .models import Invoices, Sales
from products.models import Products
from .serializers import SalesSerializer, ValidationError
from rest_framework.status import *


class SalesView(Gen):
    
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer

    def list(self, _req):
        sales: SalesSerializer = self.get_paginated_serializer()
        return self.get_paginated_response(data=sales.data)

    def create(self, req: Request):

        # Checking if the product id was informed. It will raise an exception in case it isn't
        if "sales" not in req.data.keys():
            raise ValidationError(detail={"detail": "List of sales was not informed"})

        try:
            data = { **req.data }
            products = []

            # Instanciating a new invoice and setting it's fields
            invoice = Invoices()
            invoice.gross_total = 0
            invoice.taxes = 0
            invoice.net_total = 0

            # Binding the invoice_id field to the id of the just generated invoice
            for sale in data["sales"]:
                sale: dict
                # Selecting the product for the current iteration and the amount it was bought
                cur_product: Products = Products.objects.get(pk=int(sale.get("product_id")))
                amount_bought = sale.get("amount")

                # Checking if the amount is a positive integer
                if not isinstance(amount_bought, int):
                    return res(
                        data={
                            "detail": "Purchase amount must be a valid integer"
                        },
                        status=HTTP_400_BAD_REQUEST
                    )
                elif amount_bought <= 0:
                    return res(
                        data={
                            "detail": "Purchase amount can't be less or equal to 0"
                        },
                        status=HTTP_400_BAD_REQUEST
                    )

                # Checking if is possible to buy this amount. If it is, it will update the current product's
                # amount in stock
                new_amount = cur_product.amount_in_stock - amount_bought
                if new_amount < 0:
                    return res(
                        data={
                            "detail": f"Can't buy {amount_bought} unities of {cur_product.name} because the new amount would be less than 0"
                        },
                        status=HTTP_400_BAD_REQUEST
                    )
                cur_product.amount_in_stock = new_amount

                # Doing the necessary math to calculate the taxes
                gross_total = cur_product.unity_price * amount_bought
                tax_total = ((cur_product.freight_percentage + cur_product.suppliers_percentage) / 100) * gross_total
                tax_total = round(tax_total, 2)
                net_total = gross_total - tax_total

                # Setting the invoice fields with the results from the previous calculations
                invoice.gross_total += gross_total
                invoice.taxes += tax_total
                invoice.net_total += net_total

                # Appending the product of the current iteration to a list of products in order to be updated later
                # at once, making sure that only 1 database transaction happens
                products.append(cur_product)

            # Saving the product changes in the 'amount_in_stock' field
            Products.objects.bulk_update(products, ["amount_in_stock", "updated_at"])

            # TODO: The bulk_update method is not updating the 'updated_at' field. Find a way to update it!

            # Saving the new invoice
            invoice.save()

            # Setting the 'invoice_id' field from the request to be equal to the just created invoice
            for sale in data["sales"]:
                sale: dict
                sale.update({"invoice_id": invoice.pk})

            # Serializing the new data
            sales: SalesSerializer = self.get_serializer(data=data.get("sales"), many=True)
        except Exception as error:
            raise ValidationError(detail={"detail": error})
        else:
            sales.is_valid(raise_exception=True)
            sales.save()
            return res(status=HTTP_200_OK)
