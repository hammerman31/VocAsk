from django import forms 
from .models import VocabularySets

class SubmitVocabularySets(forms.ModelForm):
    class Meta:
        model = VocabularySets
        fields = '__all__'