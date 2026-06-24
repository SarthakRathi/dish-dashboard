import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["dish_management"]
collection = db["dishes"]

initial_data = [
  {
    "dishName": "Jeera Rice",
    "dishId": "1",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/jeera-rice.jpg",
    "isPublished": True
  },
  {
    "dishName": "Paneer Tikka",
    "dishId": "2",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/paneer-tikka.jpg",
    "isPublished": True
  },
  {
    "dishName": "Rabdi",
    "dishId": "3",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/rabdi.jpg",
    "isPublished": True
  },
  {
    "dishName": "Chicken Biryani",
    "dishId": "4",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/chicken-biryani.jpg",
    "isPublished": True
  },
  {
    "dishName": "Alfredo Pasta",
    "dishId": "5",
    "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/alfredo-pasta.jpg",
    "isPublished": True
  }
]

if collection.count_documents({}) == 0:
    collection.insert_many(initial_data)
    print("Database seeded with initial JSON data.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Dish(BaseModel):
    dishId: str
    dishName: str
    imageUrl: str
    isPublished: bool

@app.get("/api/dishes", response_model=list[Dish])
def get_all_dishes():
    dishes = list(collection.find({}, {"_id": 0}))
    return dishes

@app.patch("/api/dishes/{dish_id}/toggle")
def toggle_dish_status(dish_id: str):
    dish = collection.find_one({"dishId": dish_id})
    
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    new_status = not dish.get("isPublished")
    
    collection.update_one(
        {"dishId": dish_id}, 
        {"$set": {"isPublished": new_status}}
    )
    
    return {"message": "Status toggled successfully", "dishId": dish_id, "isPublished": new_status}

@app.get("/api/dishes/stream")
async def stream_dishes():
    async def event_generator():
        last_data_state = None
        
        while True:
            dishes = list(collection.find({}, {"_id": 0}))
            current_data_state = json.dumps(dishes)
            
            if current_data_state != last_data_state:
                yield f"data: {current_data_state}\n\n"
                last_data_state = current_data_state

            await asyncio.sleep(3)

    return StreamingResponse(event_generator(), media_type="text/event-stream")