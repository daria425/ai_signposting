from services.AI_Service import VertexAI_Service
import json

# Function to read JSON data from file
def read_json_file(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

def create_input_text(option):
    website=option["Website"]
    if option["Local / National"]=="National":
        location=option["Local / National"]
    else:
        location=option["Postcode"]
    description=option["Short text description"]
    name=option["Name"]
    result={"website": website, "location": location, "description": description, "name": name}
    return result

file_path="/home/vboxuser/repos/ai_signposting/ai_api/data/sample_option_messages_local.json"
options=read_json_file(file_path)
option_summaries=[create_input_text(option) for option in options]
list_items=json.dumps(option_summaries)
user_postcode="PL25 5PQ"
user_prompt=f"""Please sort the list of python dictionaries from closest to furthest from the postcode {user_postcode} based on the value of the location key.
    Assume all postcodes are within the UK. Include only the sorted dictionaries in your response, without any additional information or code.
    Dictionaries to sort: 
    {list_items}
    """
sort_by_postcode_func_dictionary={
    "func_name": "sort_items_by_postcode", 
    "func_description": "Sorts the entries by distance from closest to furthest from a given postcode", 
    "func_params":{
      "type": "object",
      "properties": {
          "organizations": {
              "type": "array",
              "description": "A list of information on organizations",
              "items": {
                  "description": "A single organization",
                  "type": "object",
                  "properties": {
                      "name": {"type": "string", "description": "Organization name"},
                      "description": {"type": "string", "description": "A short text description of the organization"},
                       "website": {"type": "string", "description": "the website of the organization"},
                      "location": {"type": "string", "description": "The postcode of the organization to use for sorting"},
                  },
                  "required": ["website", "location", "name", "description"],
              },
          },
      },
      "required": ["organizations"],
  }
}
service=VertexAI_Service("vertexai", "gemini-1.5-flash-001")
service.get_model_response(user_prompt, {"temperature":0}, use_tool=True, function_dictionaries=[sort_by_postcode_func_dictionary])