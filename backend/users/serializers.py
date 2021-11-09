from rest_framework.serializers import ModelSerializer
from .models import Users


class UsersSerializer(ModelSerializer):

    class Meta:
        model = Users
        fields = ("id", "password", "created_at", "email", "is_active", "last_login", "is_superuser", "is_staff", "first_name", "last_name")
        extra_kwargs = {
            "id": {"read_only": True},
            "password": {"write_only": True},
            "created_at": {"read_only": True},
            "email": {"write_only": True},
        }

# is_active
# last_login
# is_superuser
# username - no need
# is_staff
# first_name
# last_name
