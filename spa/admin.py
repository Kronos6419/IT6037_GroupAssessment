from django.contrib import admin
from .models import Role, User, Category, Article
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("role_name", "description")
    search_fields = ("role_name",)


class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("role",)}),
    )
    list_display = ("username", "email", "first_name", "last_name", "role", "is_staff")
    list_filter = ("is_staff", "is_superuser", "is_active", "role")


admin.site.register(User, UserAdmin)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("category_name", "description")
    search_fields = ("category_name",)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "type")
    list_filter = ("category", "type")
    search_fields = ("name", "type", "category__category_name")
