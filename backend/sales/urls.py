from django.urls import path
from .views import SalesView


urlpatterns = [

    # Users without route params
    path(route='sales/', view=SalesView.as_view({
        'get': 'list',
        'post': 'create',
    })),

    # Users with route params
    path(route='sales/<int:pk>', view=SalesView.as_view({
        'get': 'retrieve',
    })),

]
