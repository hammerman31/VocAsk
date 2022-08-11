from django.shortcuts import render
from django.contrib import messages
from django.contrib import sessions
from django.http import HttpResponse
from .forms import VocabularyFormEn, VocabularyFormDe, TitleForm
from vocTransformer import vocTransformer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from accounts.forms import SubmitVocabularySets
from accounts.models import VocabularySets
from django.contrib.auth.models import User

# from forms import VocabularyForm

# Create your views here.
def fotos_view(request):
    return render(request, "fotos.html")


def is_ajax(request):
    return request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"


def korrektur(request):
    if is_ajax(request=request):
        txt_voc_en = request.POST.get("txt_voc_en")
        txt_voc_de = request.POST.get("txt_voc_de")
        print(txt_voc_de)
        print(txt_voc_en)

        vocsde = vocTransformer(txt_voc_de)
        vocsen = vocTransformer(txt_voc_en)

        # DE_VOC = vocsde
        request.session["vocsen"] = vocsen
        request.session["vocsde"] = vocsde
        print(vocsde)
        print(vocsen)

        formEn = VocabularyFormEn(vocsen)
        # formEn.createFields()
        formDe = VocabularyFormDe(vocsde)
        formTitle = TitleForm()
        # formDe.createFields()
        vocslen = len(vocsde)
        # messages.success(request, vocsde, extra_tags="de")
        # messages.success(request, vocsen, extra_tags="en")
        context = {"vocsen": vocsen, "vocsde": vocsde}
        # return render(request, 'success.html', context)
        message = "yes"
        # return HttpResponse(message)
        # return render(request, 'korrektur.html', {'form': formEn})
        print("waht?")
    else:
        message = "No"
        formEn = VocabularyFormEn(request.session["vocsen"])
        formDe = VocabularyFormDe(request.session["vocsde"])
        formTitle = TitleForm()
        vocslen = len(request.session["vocsde"])
        # formEn.createFields()
        print("Fuck")
    # Hier muss die Korrektur Seite zurück gegeben werden
    return render(
        request,
        "korrektur.html",
        {"formEn": formEn, "formDe": formDe, "titleField": formTitle},
    )


def abfrage(request):
    if request.method == "POST":
        # bis else ist das eigentlich irrelevant, weil es hier eine GET request geben wird
        formEn = VocabularyFormEn(request.POST)
        formDe = VocabularyFormDe(request.POST)
        if formEn.is_valid() and formDe.is_valid():
            vocsen = []
            vocsde = []
            for x in range(len(formEn.cleaned_data)):
                vocsen.append(formDe.cleaned_data[str(x) + "_de"])
                vocsde.append(formEn.cleaned_data[str(x) + "_en"])
        print("Yaaaaay")

    else:
        vocsLen = len(request.GET) / 2
        if vocsLen != 0.0:
            vocsen = []
            vocsde = []
            for x in range(1, int(vocsLen + 1)):
                vocsde.append(request.GET.get(str(x) + "_de", ""))
                vocsen.append(request.GET.get(str(x) + "_en", ""))
            if request.GET.get("title") != "":
                form1 = SubmitVocabularySets()
                form = form1.save(commit=False)
                form.title = request.GET.get("title")
                form.vocEn = str(vocsen)
                form.vocDe = str(vocsde)
                if request.user.is_authenticated:
                    form.user = request.user
                    form.save()
            messages.success(request, vocsde, extra_tags="de")
            messages.success(request, vocsen, extra_tags="en")

            return render(request, "abfrage.html")
        else:
            return render(request, "fehler.html")


def gespeichert(request):
    savedVocabularyData = VocabularySets.objects.filter(user=request.user)
    savedVocabulary = {"savedVocabulary": savedVocabularyData}
    return render(request, "gespeichert.html", savedVocabulary)


@csrf_exempt
def gespeichertZuAbfrage(request):
    if request.method == "POST":
        chosenVocs = request.POST.getlist("group[]")
        vocs = chosenVocs[0].splitlines()
        vocsde = vocs[1]
        vocsen = vocs[0]
        messages.success(request, vocsde, extra_tags="de")
        messages.success(request, vocsen, extra_tags="en")
        return render(request, "abfrage.html")


@csrf_exempt
def audio_data(request):

    data = request.GET
    # translator= Translator(to_lang="de", from_lang = "en")
    # text = data.get('text', False)
    # translation = translator.translate(text)

    if data.get("save", False):  # Change No.5
        ans = True
        # translator= Translator(to_lang="de", from_lang = "en")

        text = data.get("text", False)  # Change No.6
        # vocsen = data.get('textone', False)
        # translation = translator.translate(text)
        vocsde = data.get("texttwo", False)
        if vocsde and text:
            print("Text = ", text)  # vocsen
            print(vocsde)
            # translator= Translator(to_lang="de", from_lang = "en")
            # translation = translator.translate(text)
        else:
            ans = False

        return JsonResponse({"ans": ans})  # Change No.7

    elif data.get("success", False):  # Change No.8

        return render(request, "abfrage.html")

    # translation = translator.translate(text)xws
    return render(request, "abfrage.html")  # Change No.9n
