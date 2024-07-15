from fastapi import APIRouter
from ..models.RequestModel import RequestModel
from ..services.AI_Service import VertexAI_Service
from ..services.TranslationService import TranslationService
from ..utils.formatting import create_input_text
router=APIRouter(
    prefix='/llm'
)

@router.post("/")
def call_llm(request_body: RequestModel):
    processed_options = [create_input_text(option.model_dump(by_alias=True)) for option in request_body.options]
    llm_service=VertexAI_Service("vertexai", "gemini-1.5-flash-001")
    messages=llm_service.process_messages(processed_options, request_body.category)
    if (request_body.language!="en"):
        messages=[TranslationService(request_body.language).translate_text(message) for message in messages]
    print(messages)
    return messages