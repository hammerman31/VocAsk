from email.policy import default
from django import forms 
#from tagging.forms import TagField



def VocabularyForm3(vocList):
    "Expects a LIST of photo objects (ie. photo_sharing.models.photo)"

    fields = {}

    for id in vocList:
        id = str(id)

        fields[id+'_name'] = forms.CharField(initial=id)
        
    return type('tagVocabulary', (forms.BaseForm,), { 'base_fields': fields })


