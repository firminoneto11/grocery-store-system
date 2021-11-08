from rest_framework.viewsets import GenericViewSet
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as TS
from rest_framework_simplejwt.views import TokenObtainPairView as TOPV


class Gen(GenericViewSet):

    def get_paginated_serializer(self, new_qs=None):

        # Verifying if the 'new_qs' parameter was satisfied
        if new_qs:
            page = self.paginate_queryset(new_qs)
        else:
            page = self.paginate_queryset(self.queryset)

        # Checking if the page is None
        if page is None:
            return page
        return self.get_serializer(page, many=True)
    
    def find_element_or_none(self, model, identifier):
        """
        This function will try to get the element in the database by it's id, based on the model that is passed in the 'model'
        param. Returns None if it doesn't find any.
        """
        try:
            element = model.objects.get(pk=int(identifier))
        except Exception:
            return None
        else:
            return element


class TokenSerializer(TS):
    """
    This class is responsible for serializing the user data into a JSON Web token.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['created_at'] = str(user.created_at)
        token['last_login'] = str(user.last_login)
        token['is_active'] = user.is_active
        # ...

        return token


class Tokens(TOPV):
    serializer_class = TokenSerializer
