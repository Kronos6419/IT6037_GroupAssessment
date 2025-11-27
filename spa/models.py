from django.db import models
from django.contrib.auth.models import AbstractUser


class Role(models.Model):
    role_name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.role_name


class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

    def is_tutor(self):
        if not self.role:
            return False
        return self.role.role_name.lower() in ["tutor", "admin"]

    def is_admin(self):
        if not self.role:
            return False
        return self.role.role_name.lower() == "admin"

    def __str__(self):
        return self.username


class Category(models.Model):
    category_name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.category_name


class Article(models.Model):
    # Required fields
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    type = models.CharField(max_length=200)

    # Biography fields
    born = models.CharField(max_length=50, blank=True, null=True)
    died = models.CharField(max_length=50, blank=True, null=True)
    nationality = models.CharField(max_length=50, blank=True, null=True)
    known_for = models.CharField(max_length=200, blank=True, null=True)
    notable_work = models.CharField(max_length=200, blank=True, null=True)

    # Description
    about = models.TextField(blank=True, null=True)

    # Art fields
    year = models.CharField(max_length=50, blank=True, null=True)
    medium = models.CharField(max_length=200, blank=True, null=True)
    dimensions = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)

    designed_by = models.CharField(max_length=200, blank=True, null=True)

    developer = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name
