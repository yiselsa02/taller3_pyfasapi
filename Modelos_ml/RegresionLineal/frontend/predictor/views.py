from django.shortcuts import render


def home(request):
    return render(request, 'predictor/index.html')