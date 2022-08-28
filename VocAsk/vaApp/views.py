"""
Django views for accounts app.

"""
from django.shortcuts import render, redirect
from django.conf import settings
import requests
from .forms import ContactForm


def index(request):
    """
    Display the index page.

    **Template**

    :template:`index.html`

    """
    return render(request, "index.html")


def datenschutz(request):
    """
    Display the privacy Terms page.

    **Template**

    :template:`datenschutz.html`

    """
    return render(request, "datenschutz.html")


def impressum(request):
    """
    Display the impresssum page.

    **Template**

    :template:`impressum.html`

    """
    return render(request, "impressum.html")


def about(request):
    """
    Display the about page with a form for sending an email.

    **Context**

    ``form``
        An instance of: `ContactForm`.

    ``body``
        A dictionary containing the foerm content.

    ``message``
        A string containing the bodys content.

    **Template**

    :template:`about.html`

    """
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            body = {
                "first_name": form.cleaned_data["first_name"],
                "last_name": form.cleaned_data["last_name"],
                "email": form.cleaned_data["email_address"],
                "message": form.cleaned_data["message"],
            }
            message = "\n".join(body.values())
            send_mail(message)

            return redirect("about")
    form = ContactForm()
    return render(request, "about.html", {"form": form})


def send_mail(message):
    """
    Post request to mailgun web API for sending an email.

    """
    return requests.post(
        "https://api.mailgun.net/v3/sandbox76979eac12124c8794612a00da706320.mailgun.org/messages",
        auth=("api", settings.MAILGUN_API_KEY),
        data={
            "from": "Excited User <mailgun@sandbox76979eac12124c8794612a00da706320.mailgun.org>",
            "to": "vocaskcontact@gmail.com",
            "subject": "VocAsk Nutzernachricht",
            "text": message,
        },
    )


def anleitung(request):
    """
    Display the instuctions page.

    **Template**

    :template:`anleitung.html`

    """
    return render(request, "anleitung.html")
