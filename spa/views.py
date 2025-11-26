from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Role, User, Category, Article
from .forms import ArticleForm
from django.contrib import messages

# Create your views here.

def view_articles(request):
    category = request.GET.get("category")
    query = request.GET.get("q")
    
    articles = Article.objects.all()
    
    if category:
        articles = articles.filter(category_name__id=category)
    if query:
        articles = articles.filter(article_name__icontains=query)
        
    return render(request, "home.html", {"articles": articles})


@login_required
def add_article(request):
    if not request.user.is_tutor():
        return redirect("home")
    
    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("home")
        
    else:
        form = ArticleForm()
    
    articles = Article.objects.all()
    
    return render(request, "home.html", {"articles": articles, "form": form, "mode": "add"})


@login_required
def modify_article(request):
    if not request.user.is_tutor():
        return redirect("home")

    article_id = request.GET.get("edit")
    if not article_id:
        return redirect("home")

    article = get_object_or_404(Article, id=article_id)

    if request.method == "POST":
        form = ArticleForm(request.POST, instance=article)
        if form.is_valid():
            form.save()
            return redirect("home")
    else:
        form = ArticleForm(instance=article)

    articles = Article.objects.all()

    return render(request, "home.html", {"articles": articles, "form": form, "article_to_edit": article, "mode": "edit",})


@login_required
def remove_article(request):
    if not request.user.is_admin():
        return redirect("home")

    article_id = request.GET.get("delete")
    if not article_id:
        return redirect("home")

    article = get_object_or_404(Article, id=article_id)

    if request.method == "POST":
        article.delete()
        messages.success(request, "Article removed.")
        return redirect("home")

    articles = Article.objects.all()

    return render(request, "home.html", {"articles": articles, "article_to_delete": article, "mode": "delete",
    })