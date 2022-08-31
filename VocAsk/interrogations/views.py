"""
Django views for abfrage app.

"""
from django.shortcuts import render
from django.contrib import messages
from vocTransformer import voc_transformer
from django.views.decorators.csrf import csrf_exempt
from accounts.forms import SubmitVocabularySets
from accounts.models import VocabularySets
from .forms import VocabularyFormEn, VocabularyFormDe, TitleForm


def fotos_view(request):
    """
    Display the image page to upload images.

    **Template**

    :template:`foto-upload.html`

    """
    return render(request, "foto-upload.html")


def is_ajax(request):
    """
    Checks if incoming request is an ajax request.

    """
    return request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"


def korrektur(request):
    """
    Display the korrektur page for correcting previosly scanned from uploaded images.

    **Context**

    ``txt_voc_en``
        String scanned from image of english vocabulary from previons foto page.

    ``txt_voc_de``
        String scanned from image of german vocabulary from previons foto page.

    ``vocsde``
        German vocabulary in array.

    ``vocsen``
        English vocabulary in array.

    ``formDe``
        An instance of: `VocabularyFormDe`.

    ``formEn``
        An instance of: `VocabularyFormEn`.

    ``formTitle``
        An instance of: `TitleForm`.

    **Template**

    :template:`interrogation.html`
    :template:`vocabulary-correction.html`

    """
    if is_ajax(request=request):
        txt_voc_en = request.POST.get("txt_voc_en")
        txt_voc_de = request.POST.get("txt_voc_de")

        vocsde = voc_transformer(txt_voc_de)
        vocsen = voc_transformer(txt_voc_en)

        request.session["vocsen"] = vocsen
        request.session["vocsde"] = vocsde

    if request.method == "GET":
        formEn = VocabularyFormEn(request.session["vocsen"])
        formDe = VocabularyFormDe(request.session["vocsde"])
        formTitle = TitleForm()

        return render(
            request,
            "vocabulary-correction.html",
            {"formEn": formEn, "formDe": formDe, "titleField": formTitle},
        )
    return render(request, "interrogation.html")


def abfrage(request):
    """
    Display the abfrage page for the interrogation.
    Furthermore the vocabulary set is saved if user requested it.

    **Context**

    ``len_voc_pairs``
        The amount of german and english vocabulary pairs as a float.

    ``vocsde``
        German vocabulary in array.

    ``vocsen``
        English vocabulary in array.

    ``form``
        An instance of: `SubmitVocabularySets`.

    **Template**

    :template:`interrogation.html`
    :template:`foto-upload.html`

    """
    if request.method == "GET":
        len_voc_pairs = len(request.GET) / 2
        if len_voc_pairs != 0.0:
            vocsen = []
            vocsde = []
            for index in range(1, int(len_voc_pairs + 1)):
                vocsde.append(request.GET.get(str(index) + "_de", ""))
                vocsen.append(request.GET.get(str(index) + "_en", ""))
            if request.GET.get("title") != "":
                form = SubmitVocabularySets().save(commit=False)
                form.title = request.GET.get("title")
                form.vocEn = str(vocsen)
                form.vocDe = str(vocsde)
                if request.user.is_authenticated:
                    form.user = request.user
                    form.save()
            messages.success(request, vocsde, extra_tags="de")
            messages.success(request, vocsen, extra_tags="en")

            return render(request, "interrogation.html")
        else:
            return render(request, "foto-upload.html")


def gespeichert(request):
    """
    Display the saved vocabulary sets.

    **Context**

    ``saved_voc_data``
        Filtered vaocabulary sets from VocabularySets Model from specific user.

    ``saved_voc``
        Vocabulary saved from user in dictionary.

    **Template**

    :template:`saved-vocabulary.html`

    """
    saved_voc_data = VocabularySets.objects.filter(user=request.user)
    saved_voc = {"savedVocabulary": saved_voc_data}
    return render(request, "saved-vocabulary.html", saved_voc)


@csrf_exempt
def gespeicherte_abfrage(request):
    """
    Display the abfrage page for the interrogation after user
    chose a previously saved vocabulary sets.

    **Context**

    ``chosen_voc_set``
        The chosen vocabulary set.

    ``vocsde``
        German vocabulary in array.

    ``vocsen``
        English vocabulary in array.

    **Template**

    :template:`interrogation.html`

    """
    if request.method == "POST":
        chosen_voc_set = request.POST.getlist("group[]")
        vocs = chosen_voc_set[0].splitlines()
        vocsde = vocs[1]
        vocsen = vocs[0]
        messages.success(request, vocsde, extra_tags="de")
        messages.success(request, vocsen, extra_tags="en")
        return render(request, "interrogation.html")
