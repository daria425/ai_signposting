import os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()
MONGO_URI=os.environ.get("MONGO_URI")

class DatabaseService:
    def __init__(self, db):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[db]
    
    def close(self):
        self.client.close()

    def find_message(self, message_sid):
        collection=self.db["messages"]
        message=collection.find_one({"MessageSid": message_sid}, projection={"_id": False})
        if message is not None:
            print(message)
            return message
    

def get_database_service():
    db_service = DatabaseService("controlRoomDB_dev")  # Replace with your database name
    try:
        yield db_service
    finally:
        db_service.close()