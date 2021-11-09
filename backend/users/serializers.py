from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Users


class UsersSerializer(ModelSerializer):
    # There are automatica validations for email, password, first name and last name

    class Meta:
        model = Users

        fields = ("id", "email", "password", "first_name", "last_name", "created_at", "is_active", "last_login", "is_superuser", "is_staff")

        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "email": {"write_only": True},
            "password": {"write_only": True},
        }
    
    def validate_is_active(self, value):
        if isinstance(value, bool):
            return value
        raise ValidationError("'is_active' must be a boolean value.")
    
    def validate_is_superuser(self, value):
        if isinstance(value, bool):
            return value
        raise ValidationError("'is_superuser' must be a boolean value.")

    def validate_is_staff(self, value):
        if isinstance(value, bool):
            return value
        raise ValidationError("'is_staff' must be a boolean value.")

    def validate_last_login(self, value):
        pass


# is_active
# last_login
# is_superuser
# username - no need
# is_staff
# first_name
# last_name
