from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    This class is responsible for checking if the user that is currently logged is super user. If it is, it will allow to procede.
    """

    def has_permission(self, req, _view):
        """
        This method checks if the user has permission based on the 'is_superuser' attribute.
        """
        if req.method != 'GET':
            if req.user.is_superuser and req.user.is_active:
                return True
            return False
        return True
