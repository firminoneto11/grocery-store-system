from rest_framework.response import Response
from utils import Gen
from .serializers import UsersSerializer
from .models import Users


class UsersView(Gen):

    queryset = Users.objects.all()
    serializer_class = UsersSerializer    

    def list(self, _request):
        serializer = self.get_paginated_serializer()
        print(self.queryset)
        if serializer is None:
            serializer = self.get_serializer(instance=self.queryset, many=True)
            return Response(data=serializer.data)
        return self.get_paginated_response(data=serializer.data)

    def create(self, request):
        new_user = self.get_serializer(data=request.data)
        new_user.is_valid(raise_exception=True)
        new_user.save()
        return Response(data=new_user.data)
