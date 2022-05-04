from django.shortcuts import render
from django.contrib import messages
from django.contrib import sessions
from django.http import HttpResponse
from .forms import VocabularyForm3 
from vocTransformer import vocTransformer
#from forms import VocabularyForm

# Create your views here.
def fotos_view(request):
    return render(request, 'fotos.html')

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'




def korrektur(request):
    if is_ajax(request=request):
        txt_voc_en = request.POST.get("txt_voc_en")
        txt_voc_de = request.POST.get("txt_voc_de")
        print(txt_voc_de)
        print(txt_voc_en)

        vocsde = vocTransformer(txt_voc_de)
        vocsen = vocTransformer(txt_voc_en)

        #DE_VOC = vocsde
        request.session['vocsen'] = vocsen
        request.session['vocsde'] = vocsde
        print(vocsde)
        print(vocsen)

        formEn = VocabularyForm3(vocsen)
        #formEn.createFields()
        formDe = VocabularyForm3(vocsde)
        #formDe.createFields()

        messages.success(request, vocsde, extra_tags="de")
        messages.success(request, vocsen, extra_tags="en")
        context = {'vocsen': vocsen,
                    'vocsde': vocsde}
        #return render(request, 'success.html', context)
        message = "yes"
        #return HttpResponse(message)
        #return render(request, 'korrektur.html', {'form': formEn})
        print("waht?")
    else:
        message = "No"
        formEn = VocabularyForm3(request.session['vocsen'])
        formDe = VocabularyForm3(request.session['vocsde'])
        #formEn.createFields()
        print("Fuck")
    # Hier muss die Korrektur Seite zurück gegeben werden
    return render(request, 'korrektur.html', {'formEn': formEn, 'formDe': formDe})

