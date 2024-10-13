from fastapi import APIRouter, Depends, HTTPException, status
from ..models.TranscriptionDataModel import TranscriptionDataModel
from ..services.SpeechToTextService import SpeechToTextService
from ..services.DatabaseService import get_database_service, DatabaseService    
from pymongo import errors
router=APIRouter(prefix="/tasks")

@router.post("/transcription")
def create_transcription(request_body: TranscriptionDataModel, db_service: DatabaseService = Depends(get_database_service)):
    media_url=request_body.MediaUrl0
    message_sid=request_body.MessageSid
    speech_to_text_service=SpeechToTextService()
    try:
        transcription, gcs_uri=speech_to_text_service.handle_transcription(media_url)
        print(gcs_uri)
        db_service.update_message_text(message_sid, transcription, gcs_uri)
        return {"message": f"Message updated successfully with {transcription}", "status": 200}
    except errors.PyMongoError as db_error: 
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error in database: {db_error}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred: {e}")

    
