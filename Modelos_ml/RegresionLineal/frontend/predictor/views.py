
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests


def home(request):
    return render(request, 'predictor/index.html')


@csrf_exempt
def predict(request):

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Método no permitido'},
            status=405
        )

    try:
        data = json.loads(request.body)

        area = float(data.get('area'))

        if area <= 0:
            return JsonResponse(
                {'error': 'El área debe ser mayor que 0'},
                status=400
            )

        # URL de la API
        API_URL = "https://backend-production-5f826.up.railway.app/predict"

        # Enviar el nombre correcto que espera FastAPI
        response = requests.post(
            API_URL,
            json={
                'area_m2': area
            },
            timeout=30
        )

        resultado = response.json()

        return JsonResponse(
            resultado,
            status=response.status_code
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'JSON inválido'},
            status=400
        )

    except requests.RequestException as e:
        return JsonResponse(
            {'error': f'Error conectando con la API: {str(e)}'},
            status=502
        )

    except (TypeError, ValueError):
        return JsonResponse(
            {'error': 'El área debe ser un número válido'},
            status=400
        )
