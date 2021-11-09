from rest_framework.serializers import ModelSerializer, ValidationError
from django.contrib.auth.hashers import make_password
from .models import Users


class UsersSerializer(ModelSerializer):
    """
    This class is responsible for serializing and deserializing Users objects into JSON and vice versa. It also apply some custom
    checks and validations.
    """

    class Meta:
        model = Users

        fields = ("id", "email", "password", "first_name", "last_name", "created_at", "is_active", "last_login")

        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "email": {"write_only": True},
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        """
        This method is responsible for encrypting the user's password before inserting it in the database.
        """
        validated_data['password'] = make_password(validated_data['password'])
        return super(UsersSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        """
        This method is responsible for encrypting the user's password before a update in the password field.
        """
        if validated_data.get('password') is not None:
            validated_data['password'] = make_password(validated_data['password'])
        return super(UsersSerializer, self).update(instance, validated_data)

    def validate_last_login(self, value):
        pass
