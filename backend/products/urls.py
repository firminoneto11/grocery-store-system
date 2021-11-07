from django.urls import path
from .views import ProductsView


urlpatterns = [

    # Users without route params
    path(route='products/', view=ProductsView.as_view({
        'get': 'list',
        'post': 'create',
    }), name='users'),

    # Users with route params
    path(route='products/<int:pk>', view=ProductsView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'update',
        'delete': 'destroy',
    }), name='users')

]
