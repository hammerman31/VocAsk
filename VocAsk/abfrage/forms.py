from email.policy import default
from django import forms 
#from tagging.forms import TagField



def VocabularyFormEn(vocList):
    "Expects a LIST of photo objects (ie. photo_sharing.models.photo)"

    fields = {}

    k = 0
    for id in vocList:
        id = str(id)
        k = k+1
        fields[str(k)+'_en'] = forms.CharField(initial=id)
        
    return type('tagVocabulary', (forms.BaseForm,), { 'base_fields': fields })


def VocabularyFormDe(vocList):
    "Expects a LIST of photo objects (ie. photo_sharing.models.photo)"

    fields = {}

    k = 0
    for id in vocList:
        id = str(id)
        k = k+1
        fields[str(k)+'_de'] = forms.CharField(initial=id)
        
    return type('tagVocabulary', (forms.BaseForm,), { 'base_fields': fields })

def TitleForm():
    fields = {}
    fields['title'] = forms.CharField(max_length=45)
    return type('tagVocabulary', (forms.BaseForm,), { 'base_fields': fields})