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
        if "product_id" not in req.data.keys():
            raise ValidationError(detail={"detail": "Product id was not informed"})

        # Instanciating the sale serializer with the given data and checking if it's valid. It will raise an exception in case it 
        # isn't
        sale: SalesSerializer = self.get_serializer(data=req.data)
        sale.is_valid(raise_exception=True)

        # TODO: Implement the bussiness logic here in order to to the calculations necessary for each sell;

        # Saving the sell into the database and returning the response
        sale.save()
        return res(data=sale.data)
