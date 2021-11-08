from rest_framework.response import Response
from utils import Gen


class UsersView(Gen):

    def list(self, request):
        return Response(data={"Authenticated": "If you can see this, then you're authenticated!"})
