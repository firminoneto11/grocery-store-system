from rest_framework.response import Response as res
from .models import Products
from .serializers import ProductsSerializer
from rest_framework.status import *
from utils import Gen


class ProductsView(Gen):
    
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer

    def list(self, _req):
        """
        This method is responsible for listing all the Products that are currently registered in the system.
        """
        serializer = self.get_paginated_serializer()
        return self.get_paginated_response(data=serializer.data)

    def create(self, req):
        """
        This method is responsible for creating new products and save them in the database.
        """
        new_product = self.get_serializer(data=req.data)
        new_product.is_valid(raise_exception=True)
        new_product.save()
        return res(data=new_product.data, status=HTTP_201_CREATED)

    def retrieve(self, _req, pk):
        """
        This method is responsible for displaying only one product based on the ID that was provided in the route 
        params.
        """
        product = self.find_element_or_none(model=Products, identifier=pk)
        if product is not None:
            product = self.get_serializer(instance=product)
            return res(data=product.data)
        return res(data={"not-found": "Not found"}, status=HTTP_404_NOT_FOUND)

    def update(self, req, pk):
        """
        This method is responsible for updating a single product with the given data based on the ID that was provided 
        in the route params.
        """
        product = self.find_element_or_none(model=Products, identifier=pk)
        if product is not None:
            product = self.get_serializer(data=req.data, instance=product, partial=True)
            product.is_valid(raise_exception=True)
            product.save()
            return res(data=product.data)
        return res(status=HTTP_404_NOT_FOUND)

    def destroy(self, _req, pk):
        """
        This method is responsible for deleting a single product from the database.
        """
        product = self.find_element_or_none(model=Products, identifier=pk)
        if product is not None:
            product.delete()
            return res(status=HTTP_204_NO_CONTENT)
        return res(status=HTTP_404_NOT_FOUND)

    def findAlikes(self, _req, name):
        elements = Products.objects.filter(name__contains=name)
        elements = self.get_serializer(instance=elements, many=True)
        return res(data=elements.data)
