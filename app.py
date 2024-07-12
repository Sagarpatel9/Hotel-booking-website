import hashlib
import functools as ft
from typing import Optional

from fastapi import FastAPI, Body
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

@app.post('/search')
async def search(room: Optional[RoomModel] = Body(None)):
    # find relevant room types:

    search = Search()

    if room.tier is not None:
        search.narrow("tier", room.tier.value)
    if room.capacity is not None:
        search.narrow("capacity", room.capacity)
    if room.kitchen is not None:
        search.narrow("kitchen", room.kitchen)
    if room.smoking is not None:
        search.narrow("smoking", room.smoking)

    return search.data

class AdminLogin(BaseModel):
    password: str

def validate_admin_login(login: AdminLogin):
    _admin_login = AdminLogin(**login.model_dump())
    h = hashlib.sha256()
    h.update(_admin_login.password.encode())
    password_hash:str = h.hexdigest()
    return password_hash == ADMIN_PASSWORD



@app.put("/admin")
async def admin_put(login: AdminLogin):
    if validate_admin_login(login):
        return {"success": True, "data":Search().data}
    else:
        return {"success":False, "msg": "Invalid auth."}

@app.post("/admin")
async def admin_post(login: AdminLogin, room: RoomModel):
    if validate_admin_login(login):
        data = Search().data
        data.append({id:len(data), **room.model_dump()})
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}


@app.patch("/admin")
async def admin_patch(login: AdminLogin, room: RoomModel, id:int):
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

@app.delete("/admin")
async def admin_delete(login: AdminLogin, id:int):
    if validate_admin_login(login):
        data = Search().data
        for i in range(len(data)):
            if data[i]["id"] == id:
                del data[i]
                break
        json.dump(data, fp:=open("./rooms.json", "w"))
        fp.close()
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}
