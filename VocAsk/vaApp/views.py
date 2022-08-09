from django.shortcuts import render, redirect
from django.http import HttpResponse
import mimetypes
import os
from django.http.response import HttpResponse
from .forms import ContactForm
from django.core.mail import send_mail, BadHeaderError
import requests
from django.conf import settings

def index(request):
    return render(request, 'index.html')

def datenschutz(request):
    return render(request, 'datenschutz.html')

def about(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            body = {
			'first_name': form.cleaned_data['first_name'], 
			'last_name': form.cleaned_data['last_name'], 
			'email': form.cleaned_data['email_address'], 
			'message':form.cleaned_data['message'], 
			}
            message = "\n".join(body.values())
            send_simple_message(message)
            
            return redirect("about")
    form = ContactForm()
    return render(request, "about.html", {'form':form})

def send_simple_message(message):
	return requests.post(
		"https://api.mailgun.net/v3/sandbox76979eac12124c8794612a00da706320.mailgun.org/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data={"from": "Excited User <mailgun@sandbox76979eac12124c8794612a00da706320.mailgun.org>",
                "to": "vocaskcontact@gmail.com",
                "subject": "VocAsk Nutzernachricht",
                "text": message})
def anleitung(request):
    return render(request, 'anleitung.html')




