from django.urls import path
from interrogations import views

app_name = "interrogations"

urlpatterns = [
    path("fotos/", views.fotos_view, name="fotos"),
    path("korrektur/", views.korrektur),
    path("abfrage/", views.abfrage),
    path("gespeichert/", views.gespeichert),
    path("gespeicherte_abfrage/", views.gespeicherte_abfrage),
]
