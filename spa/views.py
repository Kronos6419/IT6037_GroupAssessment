from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout, get_user_model

import json

from .models import Role, User, Category, Article
from .forms import ArticleForm

UserModel = get_user_model()

def view_articles(request):
    """
    Main home page: list/filter/search articles.
    Unauthenticated users can access page but cannot see articles.
    """

    # Always load categories
    categories = Category.objects.all()

    # If NOT logged in -> no articles

    if not request.user.is_authenticated:
        context = {
            "categories": categories,
            "articles": [],   # important
        }
        return render(request, "home.html", context)

    # Logged in users -> apply search & filter

    category_id = request.GET.get("category")
    q = request.GET.get("q", "")

    articles = Article.objects.all()

    # Filter by category
    if category_id:
        articles = articles.filter(category_id=category_id)

    # Filter by search keyword
    if q:
        articles = articles.filter(name__icontains=q)

    context = {
        "categories": categories,
        "articles": articles,
    }

    return render(request, "home.html", context)

@login_required
def add_article(request):
    """
    Classic Django add-article view (form-based).
    This remains as a fallback; SPA will use the JSON API instead.
    """
    if not (request.user.is_tutor() or request.user.is_admin()):
        messages.error(request, "You do not have permission to add articles.")
        return redirect("home")

    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Article added successfully.")
            return redirect("home")
    else:
        form = ArticleForm()

    categories = Category.objects.all()
    articles = Article.objects.all()

    context = {
        "form": form,
        "mode": "add",
        "categories": categories,
        "articles": articles,
    }
    return render(request, "home.html", context)


@login_required
def modify_article(request):
    """
    Classic Django edit view.
    For now, looks for ?edit=<id> in query string.
    SPA will later use separate JSON endpoints.
    """
    if not (request.user.is_tutor() or request.user.is_admin()):
        messages.error(request, "You do not have permission to modify articles.")
        return redirect("home")

    article_id = request.GET.get("edit")
    article = get_object_or_404(Article, id=article_id)

    if request.method == "POST":
        form = ArticleForm(request.POST, instance=article)
        if form.is_valid():
            form.save()
            messages.success(request, "Article updated successfully.")
            return redirect("home")
    else:
        form = ArticleForm(instance=article)

    categories = Category.objects.all()
    articles = Article.objects.all()

    context = {
        "form": form,
        "mode": "edit",
        "edit_article": article,
        "categories": categories,
        "articles": articles,
    }
    return render(request, "home.html", context)


@login_required
def remove_article(request):
    """
    Classic Django delete view.
    For now, looks for ?delete=<id> in query string.
    SPA will later use separate JSON endpoints.
    """
    if not request.user.is_admin():
        messages.error(request, "Only admins can delete articles.")
        return redirect("home")

    article_id = request.GET.get("delete")
    article = get_object_or_404(Article, id=article_id)

    if request.method == "POST":
        article.delete()
        messages.success(request, "Article deleted successfully.")
        return redirect("home")

    categories = Category.objects.all()
    articles = Article.objects.all()

    context = {
        "confirm_delete": True,
        "delete_article": article,
        "categories": categories,
        "articles": articles,
    }
    return render(request, "home.html", context)


# Role helper

def _get_user_role(user):
    if not user.is_authenticated:
        return None
    if hasattr(user, "is_admin") and user.is_admin():
        return "admin"
    if hasattr(user, "is_tutor") and user.is_tutor():
        return "tutor"
    return "student"


# Auth

@csrf_exempt
def api_login(request):
    """
    POST /api/auth/login/
    JSON: { "email": "...", "password": "..." }
    Uses Django session auth, returns JSON.
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return JsonResponse({"error": "Email and password required"}, status=400)

    user_obj = UserModel.objects.filter(email=email).first()
    username = user_obj.username if user_obj else email

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    login(request, user)

    return JsonResponse(
        {
            "success": True,
            "username": user.username,
            "role": _get_user_role(user),
            "isAuthenticated": True,
        }
    )


@csrf_exempt
def api_logout(request):
    """
    POST /api/auth/logout/
    Logs out the current user.
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    logout(request)
    return JsonResponse({"success": True})


@csrf_exempt
def api_me(request):
    """
    GET /api/auth/me/
    Returns current user info.
    """
    user = request.user
    return JsonResponse(
        {
            "isAuthenticated": user.is_authenticated,
            "username": user.username if user.is_authenticated else "",
            "role": _get_user_role(user),
        }
    )


# Article Add

@csrf_exempt
def api_add_article(request):
    """
    POST /api/articles/add/
    JSON body with fields for Article.
    Requires tutor or admin.
    """
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    if not (user.is_tutor() or user.is_admin()):
        return JsonResponse({"error": "Permission denied"}, status=403)

    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    name = data.get("name", "").strip()
    article_type = data.get("type", "").strip()
    category_id = data.get("category_id")

    if not name or not article_type or not category_id:
        return JsonResponse(
            {"error": "name, type and category_id are required."}, status=400
        )

    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return JsonResponse({"error": "Category not found."}, status=400)

    article = Article.objects.create(
        name=name,
        type=article_type,
        category=category,
        born=data.get("born", "") or None,
        died=data.get("died", "") or None,
        nationality=data.get("nationality", "") or None,
        known_for=data.get("known_for", "") or None,
        notable_work=data.get("notable_work", "") or None,
        about=data.get("about", "") or None,
        year=data.get("year", "") or None,
        medium=data.get("medium", "") or None,
        dimensions=data.get("dimensions", "") or None,
        location=data.get("location", "") or None,
        designed_by=data.get("designed_by", "") or None,
        developer=data.get("developer", "") or None,
    )

    return JsonResponse(
        {
            "success": True,
            "article": {
                "id": article.id,
                "name": article.name,
                "type": article.type,
                "category": article.category.category_name,
            },
        }
    )

# Articles Edit

@csrf_exempt
def api_get_article(request, article_id):
    """
    GET /api/articles/<id>/
    Returns article data as JSON (for Edit popup).
    """
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    if not (user.is_tutor() or user.is_admin()):
        return JsonResponse({"error": "Permission denied"}, status=403)

    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=405)

    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({"error": "Article not found"}, status=404)

    return JsonResponse({
        "id": article.id,
        "name": article.name,
        "type": article.type,
        "category_id": article.category.id,
        "category_name": article.category.category_name,
        "born": article.born or "",
        "died": article.died or "",
        "nationality": article.nationality or "",
        "known_for": article.known_for or "",
        "notable_work": article.notable_work or "",
        "about": article.about or "",
        "year": article.year or "",
        "medium": article.medium or "",
        "dimensions": article.dimensions or "",
        "location": article.location or "",
        "designed_by": article.designed_by or "",
        "developer": article.developer or "",
    })
    

@csrf_exempt
def api_edit_article(request, article_id):
    """
    POST /api/articles/<id>/edit/
    Updates an article (Edit popup).
    """
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    if not (user.is_tutor() or user.is_admin()):
        return JsonResponse({"error": "Permission denied"}, status=403)

    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({"error": "Article not found"}, status=404)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    name = data.get("name", "").strip()
    article_type = data.get("type", "").strip()
    category_id = data.get("category_id")

    if not name or not article_type or not category_id:
        return JsonResponse(
            {"error": "name, type and category_id are required."}, status=400
        )

    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return JsonResponse({"error": "Category not found."}, status=400)

    # update fields
    article.name = name
    article.type = article_type
    article.category = category
    article.born = data.get("born", "") or None
    article.died = data.get("died", "") or None
    article.nationality = data.get("nationality", "") or None
    article.known_for = data.get("known_for", "") or None
    article.notable_work = data.get("notable_work", "") or None
    article.about = data.get("about", "") or None
    article.year = data.get("year", "") or None
    article.medium = data.get("medium", "") or None
    article.dimensions = data.get("dimensions", "") or None
    article.location = data.get("location", "") or None
    article.designed_by = data.get("designed_by", "") or None
    article.developer = data.get("developer", "") or None

    article.save()

    return JsonResponse({"success": True})

# Delete Article

@csrf_exempt
def api_delete_article(request, article_id):
    """
    POST /api/articles/<id>/delete/
    Deletes an article (Delete confirmation popup).
    Admin only.
    """
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    if not user.is_admin():
        return JsonResponse({"error": "Only admins can delete articles."}, status=403)

    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return JsonResponse({"error": "Article not found"}, status=404)

    article.delete()
    return JsonResponse({"success": True})