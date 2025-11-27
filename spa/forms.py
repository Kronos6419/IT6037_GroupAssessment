from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = [
            "name",
            "category",
            "type",
            "born",
            "died",
            "nationality",
            "known_for",
            "notable_work",
            "about",
            "year",
            "medium",
            "dimensions",
            "location",
            "designed_by",
            "developer",
        ]
