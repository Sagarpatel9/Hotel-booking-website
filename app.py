import hashlib
import functools as ft

from fastapi import FastAPI
from entities import RoomModel
from search import Search

from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

___h = hashlib.sha256()
___h.update(os.environ["ADMIN_PASSWORD"].encode())

ADMIN_PASSWORD:str = ___h.hexdigest()

app = FastAPI()



@app.get('/search')
def search(room_search_inst: RoomModel):
    # validate the search
    room_query = RoomModel(**room_search_inst.model_dump())
    
    # find relevant room types:

    search = Search()

    search.narrow("tier", room_query.tier.value)
    search.narrow("capacity", room_query.capacity)
    search.narrow("kitchen", room_query.kitchen)
    search.narrow("smoking", room_query.smoking)

    return search.data

class AdminLogin(BaseModel):
    password: str

def validate_admin_login(login: AdminLogin):
    _admin_login = AdminLogin(**login.model_dump())
    h = hashlib.sha256()
    h.update(_admin_login.password.encode())
    password_hash:str = h.hexdigest()
    return password_hash == ADMIN_PASSWORD



@app.get("/admin")
def admin_endpoint(login: AdminLogin):
    if validate_admin_login(login):
        return {"Success": "Admin login successful."}
    else:
        return {"Error": "Invalid auth."}
