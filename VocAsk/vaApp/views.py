from django.shortcuts import render, redirect
from django.http import HttpResponse
import mimetypes
import os
from django.http.response import HttpResponse
from .forms import ContactForm
from django.core.mail import send_mail, BadHeaderError

def index(request):
    return render(request, 'index.html')

def datenschutz(request):
    return render(request, 'datenschutz.html')

def about(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            subject = "Website Inquiry" 
            body = {
			'first_name': form.cleaned_data['first_name'], 
			'last_name': form.cleaned_data['last_name'], 
			'email': form.cleaned_data['email_address'], 
			'message':form.cleaned_data['message'], 
			}
            message = "\n".join(body.values())
            try:
                send_mail(subject, message, 'VocAskContact@gmail.com', ['VocAskContact@gmail.com']) 
            except BadHeaderError:
                return HttpResponse('Invalid header found.')
            return redirect("index")
    form = ContactForm()
    return render(request, "about.html", {'form':form})

def anleitung(request):
    return render(request, 'anleitung.html')




