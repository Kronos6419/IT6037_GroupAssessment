from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = [
            "category_name",
            "type",
            "article_name",
            "born",
            "died",
            "nationality",
            "known_for",
            "notable_work",
            "about",
            "painting_year",
            "painting_medium",
            "painting_dimensions",
            "painting_location",
            "developer",
        ]