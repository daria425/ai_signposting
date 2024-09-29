import requests
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv
load_dotenv()
media_url=os.environ.get("TEST_MEDIA_URL")
username=os.environ.get("TWILIO_ACCOUNT_SID")
password=os.environ.get("TWILIO_AUTH_TOKEN")
def download_audio(audio_url, save_dir="audio_downloads"):
    basic_auth=HTTPBasicAuth(username, password)
    os.makedirs(save_dir, exist_ok=True)
    file_name=audio_url.split("/")[-1]
    response=requests.get(media_url, auth=basic_auth)
    if response.status_code==200:
        content_type = response.headers.get('Content-Type')
        extension = content_type.split('/')[-1]
        file_path = os.path.join(save_dir, f"{file_name}.{extension}")
        with open(file_path, 'wb') as f:
            f.write(response.content)
        
        print(f"Media downloaded successfully and saved as {file_path}")
    else:
        print(f"Failed to download media. Status code: {response}")

# download_audio(media_url)