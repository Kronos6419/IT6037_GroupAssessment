from django.db import models
from django.contrib.auth.models import AbstractUser

class Role(models.Model):
    role_name = models.CharField(max_length=50, unique=True)
    role_description = models.TextField(blank=True)

    def __str__(self):
        return self.role_name

class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)

    def is_tutor(self):
        return self.role and self.role.role_name in ['tutor', 'admin']

    def is_admin(self):
        return self.role and self.role.role_name == 'admin'


class Category(models.Model):
    category_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.category_name

class Article(models.Model):
    category_name = models.ForeignKey(Category, on_delete=models.CASCADE)
    type = models.CharField(max_length=200)
    article_name = models.CharField(max_length=100)
    born = models.CharField(max_length=50, blank=True)
    died = models.CharField(max_length=50, blank=True)
    nationality = models.CharField(max_length=50)
    known_for = models.CharField(max_length=50)
    notable_work = models.CharField(max_length=50)
    about = models.TextField()
    painting_year = models.CharField(max_length=50, blank=True)
    painting_medium = models.CharField(max_length=200, blank=True)
    painting_dimensions = models.CharField(max_length=200, blank=True)
    painting_location = models.CharField(max_length=200, blank=True)
    developer = models.CharField(max_length=200, blank=True)

    def __str__(self):  
        return self.article_name