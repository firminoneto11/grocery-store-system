from rest_framework.serializers import ModelSerializer, ValidationError
from django.contrib.auth.hashers import make_password
from .models import Users


class UsersSerializer(ModelSerializer):
    # There are automatic validations for email, password, first name and last name

    class Meta:
        model = Users

        fields = ("id", "email", "password", "first_name", "last_name", "created_at", "is_active", "last_login")

        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "email": {"write_only": True},
            "password": {"write_only": True},
        }

    # def create(self, validated_data):
    #     validated_data['password'] = make_password(validated_data['password'])
    #     return super(UsersSerializer, self).create(validated_data)

    def validate_is_active(self, value):
        if isinstance(value, bool):
            return value
        raise ValidationError("'is_active' must be a boolean value.")

    def validate_last_login(self, value):
        pass


# is_superuser -> Can not be set
# is_staff -> Can not be set
