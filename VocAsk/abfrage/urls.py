from django.urls import path
from abfrage import views

app_name = 'abfrage'

urlpatterns = [
    path('fotos/', views.fotos_view, name="fotos"),
    path('korrektur/', views.korrektur),
    path('abfrage/', views.abfrage),
    path('gespeichert/', views.gespeichert),
]