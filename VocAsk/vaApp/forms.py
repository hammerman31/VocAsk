from django import forms


class ContactForm(forms.Form):
	first_name = forms.CharField(label= 'Vorname', max_length = 50)
	last_name = forms.CharField(label= 'Nachname', max_length = 50)
	email_address = forms.EmailField(label= 'Email Adresse', max_length = 150)
	message = forms.CharField(label= 'Nachricht', widget = forms.Textarea, max_length = 2000)