import hashlib
import functools as ft

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from entities import RoomModel
from search import Search

from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json


load_dotenv()

___h = hashlib.sha256()
___h.update(os.environ["ADMIN_PASSWORD"].encode())

ADMIN_PASSWORD:str = ___h.hexdigest()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

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
def admin_get(login: AdminLogin):
    if validate_admin_login(login):
        return {"success": True, "data":Search().data}
    else:
        return {"success":False, "msg": "Invalid auth."}

@app.post("/admin")
def admin_post(login: AdminLogin, room: RoomModel):
    if validate_admin_login(login):
        data = Search().data
        data.append({id:len(data), **room.model_dump()})
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}


@app.put("/admin")
def admin_put(login: AdminLogin, room: RoomModel, id:int):
    if validate_admin_login(login):
        data = Search().data
        for d in data:
            if d["id"] == id:
                if room.tier is not None:
                    d["tier"] = room.tier.value
                if room.price is not None:
                    d["price"] = room.price
                if room.capacity is not None:
                    d["capacity"] = room.capacity
                if room.smoking is not None:
                    d["smoking"] = room.smoking
                if room.kitchen is not None:
                    d["kitchen"] = room.kitchen
                break
        json.dump(data, fp:=open("./rooms.json", "w"))
        fp.close()
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}
