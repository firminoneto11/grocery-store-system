from django.urls import path
from .views import UsersView


urlpatterns = [

    # Users without route params
    path(route='users/', view=UsersView.as_view({
        'get': 'list',
        'post': 'create',
    }), name='users'),

    # Users with route params
    path(route='users/<int:pk>/', view=UsersView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'update',
        'delete': 'destroy',
    }), name='users')

]
