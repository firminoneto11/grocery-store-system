from rest_framework.response import Response as res
from rest_framework.request import Request
from utils import Gen
from .models import Invoices, Sales
from .serializers import SalesSerializer, ValidationError, Products
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

        # TODO: Implement the bussiness logic here in order to to the calculations necessary for each sell;
        try:
            data = { **req.data }

            # Instanciating a new invoice and setting it's fields
            invoice = Invoices()
            invoice.taxes = 0
            invoice.gross_total = 0
            invoice.net_total = 0
            invoice.save()

            # Binding the invoice_id field to the id of the just generated invoice
            for sale in data["sales"]:
                sale["invoice_id"] = invoice.pk
    
            sales: SalesSerializer = self.get_serializer(data=data.get("sales"), many=True)
        except Exception as error:
            raise ValidationError(detail={"detail": error})
        else:
            sales.is_valid(raise_exception=True)
            sales.save()
            return res(status=HTTP_200_OK)

        """
        # Instanciating the sale serializer with the given data and checking if it's valid. It will raise an exception in case 
        # it isn't
        sale: SalesSerializer = self.get_serializer(data=req.data)
        sale.is_valid(raise_exception=True)

        # Saving the sell into the database and returning the response
        sale.save()
        return res(data=sale.data)

        list(map(lambda sale: self.get_serializer(data={ **sale }), data["sales"]))
        """
