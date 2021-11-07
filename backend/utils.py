from rest_framework.viewsets import GenericViewSet


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
