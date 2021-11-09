from rest_framework.response import Response
from utils import Gen
from .serializers import UsersSerializer
from .models import Users


class UsersView(Gen):

    queryset = Users.objects.all()
    serializer_class = UsersSerializer    

    def list(self, _request):
        serializer = self.get_paginated_serializer()
        if serializer is None:
            serializer = self.get_serializer(instance=self.queryset, many=True)
            return Response(data=serializer.data)
        return self.get_paginated_response(data=serializer.data)

    def create(self, request):
        pass
