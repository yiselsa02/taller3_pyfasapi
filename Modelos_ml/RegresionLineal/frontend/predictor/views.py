from django.shortcuts import render
from django.http import JsonResponse
import requests


def home(request):
    return render(request, 'predictor/index.html')


def predict(request):

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Método no permitido'},
            status=405
        )

    try:

        data = request.POST
        area = data.get('area')

        if not area:
            return JsonResponse(
                {'error': 'Debes ingresar el área'},
                status=400
            )

        # URL DE TU API
        API_URL = "https://taller3pyfasapi-production.up.railway.app/predict/"

        response = requests.post(
            API_URL,
            json={
                'area': float(area)
            }
        )

        resultado = response.json()

        return JsonResponse(resultado, status=response.status_code)

    except Exception as e:

        return JsonResponse(
            {'error': str(e)},
            status=500
        )