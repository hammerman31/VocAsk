from django.shortcuts import render

# Create your views here.
def fotos_view(request):
    return render(request, 'fotos.html')