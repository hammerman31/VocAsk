from django.urls import path
from interrogations import views

app_name = "interrogations"

urlpatterns = [
    path("fotos/", views.fotos_view, name="fotos"),
    path("korrektur/", views.vocabulary_correction),
    path("abfrage/", views.interrogation),
    path("gespeichert/", views.saved_vocabulary),
    path("gespeicherte_abfrage/", views.saved_vocabulary_interrogation),
]
