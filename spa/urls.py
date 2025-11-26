from django.contrib import admin
from django.urls import include, path
from . import views
urlpatterns = [
    path("home/", views.view_articles, name="home"),
    path("add/", views.add_article, name="add"),
    path("modify/", views.modify_article, name="modify"),
    path("remove/", views.remove_article, name="remove")
]
# still need multiple urls for add/modify/remove requirements. this is still single-page