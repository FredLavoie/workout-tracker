from rest_framework import permissions

class IsAuthor(permissions.BasePermission):
    def has_permission(self, request, view):
        return str(request.user.id) == request.path.split('/')[2]
