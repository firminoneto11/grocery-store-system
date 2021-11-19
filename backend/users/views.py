from rest_framework.response import Response as res
from rest_framework.status import *
from utils import Gen
from .serializers import UsersSerializer
from .models import Users
from .permissions import IsSuperUser


class UsersView(Gen):

    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = (IsSuperUser, )

    def list(self, _req):
        """
        This method is responsible for listing all the users that currently are registered in the system.
        """
        serializer = self.get_paginated_serializer()
        return self.get_paginated_response(data=serializer.data)

    def create(self, request):
        """
        This method is responsible for registering new users in the system.
        """
        new_user = self.get_serializer(data=request.data)
        new_user.is_valid(raise_exception=True)
        new_user.save()
        return res(data=new_user.data, status=HTTP_201_CREATED)

    def retrieve(self, _request, pk):
        """
        This method is responsible for retrieving a single user that is registered in the system.
        """
        user = self.find_element_or_none(model=Users, identifier=pk)
        if user is not None:
            user = self.get_serializer(instance=user)
            return res(data=user.data)
        return res(status=HTTP_404_NOT_FOUND)
    
    def update(self, req, pk):
        """
        This method is responsible for updating the user's info in at least one of the fields with the given data based on the ID 
        that was provided in the route params.
        """
        user = self.find_element_or_none(model=Users, identifier=pk)
        if user is not None:
            user = self.get_serializer(instance=user, data=req.data, partial=True)
            user.is_valid(raise_exception=True)
            user.save()
            return res(data=user.data)
        return res(status=HTTP_404_NOT_FOUND)

    def destroy(self, _request, pk):
        """
        This method is responsible for deleting a user from the system. It's a soft deletion, so it just changes the 'is_active' 
        attribute to False.
        """
        user = self.find_element_or_none(model=Users, identifier=pk)
        if user is not None:
            if user.is_active:
                user.is_active = 0
                user.save()
            return res(status=HTTP_204_NO_CONTENT)
        return res(status=HTTP_404_NOT_FOUND)
