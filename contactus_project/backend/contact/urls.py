from django.urls import path
from . import views

urlpatterns = [
    path('contact/', views.create_contact, name='create_contact'),
]