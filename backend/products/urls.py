from django.urls import path
from .views import ProductsView


urlpatterns = [

    # Products without route params
    path(route='products/', view=ProductsView.as_view({
        'get': 'list',
        'post': 'create',
    }), name='users'),

    # Products with route params
    path(route='products/<int:pk>', view=ProductsView.as_view({
        'get': 'retrieve',
        'patch': 'update',
        'delete': 'destroy',
    }), name='users')

]
