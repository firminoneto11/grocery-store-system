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
    element_not_found = {"invalid_user": "User not found with the given id."}

    def list(self, _req):
        """
        This method is responsible for listing all the users that currently are registered in the system.
        """
        serializer = self.get_paginated_serializer()
        if serializer is None:
            serializer = self.get_serializer(instance=self.queryset, many=True)
            return res(data=serializer.data)
        return self.get_paginated_response(data=serializer.data)

    def create(self, request):
        """
        This method is responsible for registering new users in the system.
        """
        new_user = self.get_serializer(data=request.data)
        new_user.is_valid(raise_exception=True)
        new_user.save()
        return res(data={"success": request.data}, status=HTTP_201_CREATED)

    def retrieve(self, _request, pk):
        """
        This method is responsible for retrieving a single user that is registered in the system.
        """
        user = self.find_element_or_none(model=Users, identifier=pk)
        if user is None:
            return res(data=self.element_not_found, status=HTTP_404_NOT_FOUND)
        user = self.get_serializer(instance=user)
        return res(data=user.data)
    
    def update(self, req, pk):
        """
        This method is responsible for updating the user's info in at least one of the fields.
        """
        user = self.find_element_or_none(model=Users, identifier=pk)
        if user is None:
            return res(data=self.element_not_found, status=HTTP_404_NOT_FOUND)
        
        user = self.get_serializer(instance=user, data=req.data, partial=True)
        user.is_valid(raise_exception=True)
        user.save()
        return res(data=user.data)

    def destroy(self, _request, pk):
        """
        This method is responsible for deleting a user from the system. It's a soft deletion, so it just changes the 'is_active' 
        attribute to False.
        """
        user = self.find_element_or_none(model=Users, identifier=pk)
        if user is None:
            return res(data=self.element_not_found, status=HTTP_404_NOT_FOUND)
        
        if user.is_active:
            user.is_active = 0
            user.save()
            return res(data={"success": "User deleted successfully."}, status=HTTP_204_NO_CONTENT)
        
        return res(data={"detail": "User was deleted already."})
