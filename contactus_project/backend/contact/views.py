from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ContactSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def create_contact(request):
    try:
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Contact form submitted successfully'},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'message': 'Invalid data', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        return Response(
            {'message': 'An error occurred while processing your request'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )