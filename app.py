from fastapi import FastAPI
from enum import Enum
from pydantic import BaseModel, PositiveInt
import json

ROOM_TYPES_DATA = json.load(fp:=open("rooms.json"))
fp.close()

class RoomTier(str, Enum):
    basic = "basic"
    business = "business"
    vip = "vip"
    

class RoomModel(BaseModel):
    tier: RoomTier | None = None
    capacity: PositiveInt | None = None
    kitchen: bool | None = None
    smoking: bool | None = None
    price: float | None = None

app = FastAPI()

@app.get('/search')
def search(room_search_inst: RoomModel):
    # validate the search
    room_query = RoomModel(**room_search_inst.model_dump())
    
    # find relevant room types:

    for room in ROOM_TYPES_DATA:
        r_tier = room["tier"]
        r_capacity = room["capacity"]
        r_kitchen = room["kitchen"]
        r_smoking = room["smoking"]
        r_price = room["price"]

        if room_query.tier 


    return []
