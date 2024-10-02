from fastapi import APIRouter, Depends
from ..models.TranscriptionDataModel import TranscriptionDataModel
from ..services.SpeechToTextService import SpeechToTextService
from ..services.DatabaseService import get_database_service, DatabaseService    
router=APIRouter(prefix="/transcription")

@router.post("/")
def create_transcription(request_body: TranscriptionDataModel, db_service: DatabaseService = Depends(get_database_service)):
    media_url=request_body.MediaUrl0
    message_sid=request_body.MessageSid
    speech_to_text_service=SpeechToTextService()
    transcription=speech_to_text_service.handle_transcription(media_url)
    message=db_service.find_message(message_sid)
    return message
