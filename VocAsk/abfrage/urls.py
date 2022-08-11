from django.urls import path

# from VocAsk.abfrage.views import gespeichertZuAbfrage
from abfrage import views

app_name = "abfrage"

urlpatterns = [
    path("fotos/", views.fotos_view, name="fotos"),
    path("korrektur/", views.korrektur),
    path("abfrage/", views.abfrage),
    path("gespeichert/", views.gespeichert),
    path("gespeichertZuAbfrage/", views.gespeichertZuAbfrage),
]
