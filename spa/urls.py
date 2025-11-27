from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    # Home page
    path("", views.view_articles, name="home"),
    path("home/", views.view_articles, name="home"),

    # Django views
    path("add/", views.add_article, name="add_article"),
    path("modify/", views.modify_article, name="modify_article"),
    path("remove/", views.remove_article, name="remove_article"),

    # Auth JSON API
    path("api/auth/login/", views.api_login, name="api_login"),
    path("api/auth/logout/", views.api_logout, name="api_logout"),
    path("api/auth/me/", views.api_me, name="api_me"),

    # Article JSON API
    path("api/articles/add/", views.api_add_article, name="api_add_article"),
    path("api/articles/<int:article_id>/", views.api_get_article, name="api_get_article"),
    path("api/articles/<int:article_id>/edit/", views.api_edit_article, name="api_edit_article"),
    path("api/articles/<int:article_id>/delete/", views.api_delete_article, name="api_delete_article"),
]
