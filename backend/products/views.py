from rest_framework.response import Response as res
from .models import Products
from .serializers import ProductsSerializer
from rest_framework.status import *
from utils import Gen


class ProductsView(Gen):
    
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer

    def list(self, _req):
        serializer = self.get_paginated_serializer()
        return self.get_paginated_response(data=serializer.data)

    def create(self, req):
        new_product = self.get_serializer(data=req.data)
        new_product.is_valid(raise_exception=True)
        new_product.save()
        return res(data=new_product.data, status=HTTP_201_CREATED)
