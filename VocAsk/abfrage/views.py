from django.shortcuts import render
from django.contrib import messages
from django.http import HttpResponse
from vocTransformer import vocTransformer
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
        print(vocsde)
        print(vocsen)
        messages.success(request, vocsde, extra_tags="de")
        messages.success(request, vocsen, extra_tags="en")
        context = {'vocsen': vocsen,
                    'vocsde': vocsde}
        #return render(request, 'success.html', context)
        message = "yes"
        return HttpResponse(message)
    else:
        message = "No"
    # Hier muss die Korrektur Seite zurück gegeben werden
    return render(request, 'index.html')
