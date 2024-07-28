import hashlib
import functools as ft
from typing import Optional

from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from entities import RoomModel, Booking

from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
from db import DataBase

load_dotenv()

DB = DataBase()

___h = hashlib.sha256()
___h.update(os.environ["ADMIN_PASSWORD"].encode())

ADMIN_PASSWORD:str = ___h.hexdigest()

app = FastAPI()

@app.post('/')
async def root_post():
    return {"version":"1.0"}

@app.post('/info')
async def root_post():
    return {"version":"1.0"}

@app.post('/room/search')
async def search(room: Optional[RoomModel] = Body(None)):
    # find relevant room types:

    search = {}

    print(room)

    if room.id is not None:
        search["id"] = ('=', room.id)
    if room.tier is not None:
        search["tier"] = ('=', room.tier.value)
    if room.capacity is not None:
        search["capacity"] = ('=', room.capacity)
    if room.price is not None:
        search["price"] = ('=', room.price)
    if room.kitchen is not None:
        search["kitchen"] = ('=', room.kitchen)
    if room.smoking is not None:
        search["smoking"] = ('=', room.smoking)
    
    rooms = DB.get_room(search)

    return rooms


class AdminLogin(BaseModel):
    password: str

class UserLogin(BaseModel):
    name: str
    password: str

def validate_admin_login(login: AdminLogin):
    _admin_login = AdminLogin(**login.model_dump())
    h = hashlib.sha256()
    h.update(_admin_login.password.encode())
    password_hash:str = h.hexdigest()
    return password_hash == ADMIN_PASSWORD

def hash_str(inp:str):
    h = hashlib.sha256()
    h.update(inp.encode())
    return h.hexdigest()
        


@app.post("/admin/room")
async def create_room(login: AdminLogin, room: RoomModel):
    if validate_admin_login(login):
        try:
            DB.create_room(room.tier.value, room.capacity, room.smoking, room.kitchen, room.price)
        except RuntimeError as e:
            return {"success": False, "msg": str(e)}
        except Exception as e:
            return {"success": False, "msg": str(e)}
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}

@app.delete("/admin/room")
async def delete_room(login: AdminLogin, room: RoomModel):
    if validate_admin_login(login):
        try:
            DB.delete_room({'id':('=', room.id)})
        except Exception as e:
            print(e)
            return {"success": False, "msg": "Failed to delete room."}
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}
    

@app.post('/admin/booking')
async def create_booking(login: AdminLogin, booking: Booking):
    if validate_admin_login(login):
        try:
            DB.create_booking(booking.f_name, booking.l_name, booking.address_1, booking.address_2,
                booking.city, booking.state, booking.zip_code, booking.phone, booking.email, booking.check_in,
                booking.check_out, hash_str(booking.checkin_key), booking.room_id)
        except RuntimeError as e:
            return {"success": False, "msg": str(e)}
        except Exception as e:
            return {"success": False, "msg": "Failed to create booking."}
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}
    
@app.patch('/admin/booking')
async def get_booking(login: AdminLogin, booking: Booking):
    if validate_admin_login(login):
        try:
            return DB.get_booking({'f_name':('=',booking.f_name), 'l_name':('=',booking.l_name), 'address_1':('=',booking.address_1), 'address_2':('=',booking.address_2),
                'city':('=',booking.city), 'state':('=',booking.state), 'zip_code':('=',booking.zip_code), 'phone':('=',booking.phone), 'email':('=',booking.email),
                'check_in':('=',booking.check_in), 'check_out':('=',booking.check_out),
                'checkin_key':('=',booking.checkin_key), 'room_id':('=',booking.room_id)})
        except:
            return {"success": False, "msg": "Failed to get booking."}
    else:
        return {"success": False, "msg": "Invalid auth."}
    
@app.patch('/user/booking')
async def user_get_booking(login:UserLogin):
    print(login)
    try:
        b_list = DB.get_booking({'f_name':('=',login.name), 'checkin_key':('=',hash_str(login.password))})
        if b_list == None or len(b_list) == 0:
            return {"success": False, "msg": "Failed to get booking.  Could not find a booking with the provided name and check-in key."}
        return b_list
    except Exception as e:
        return {"success": False, "msg": f"Failed to get booking.  Invalid Auth.  ({str(e)})"}
    
@app.post('/user/booking')
async def user_create_booking(booking: Booking):
    try:
        DB.create_booking(booking.f_name, booking.l_name, booking.address_1, booking.address_2,
            booking.city, booking.state, booking.zip_code, booking.phone, booking.email, booking.check_in,
            booking.check_out, hash_str(booking.checkin_key), booking.room_id)
    except RuntimeError as e:
        return {"success": False, "msg": str(e)}
    except Exception as e:
        return {"success": False, "msg": str(e)}
    return {"success":True}

@app.delete('/user/booking')
async def user_delete_booking(login:UserLogin):
    try:
        DB.delete_booking({'f_name':('=',login.name), 'checkin_key':('=',hash_str(login.password))})
    except RuntimeError as e:
        return {"success": False, "msg": str(e)}
    except Exception as e:
        return {"success": False, "msg": str(e)}
    return {"success":True}

class CheckDate(BaseModel):
    check_in: str
    check_out: str
    room_id: int

@app.post('/user/booking/checkdate')
async def user_check_date(body: CheckDate):
    return {"overlap":DB.check_date_overlap(body.check_in, body.check_out, body.room_id)}
    
@app.put('/admin/booking')
async def update_booking(login: AdminLogin, booking: Booking):
    if validate_admin_login(login):
        try:
            DB.update_booking({'f_name':booking.f_name, 'l_name':booking.l_name, 'address_1':booking.address_1, 'address_2':booking.address_2,
                'city':booking.city, 'state':booking.state, 'zip_code':booking.zip_code, 'phone':booking.phone, 'email':booking.email,
                'check_in':booking.check_in, 'check_out':booking.check_out,
                'checkin_key':booking.checkin_key, 'room_id':booking.room_id},
                {'id':('=',booking.id)}
            )
        except:
            return {"success": False, "msg": "Failed to update booking."}
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}
    
@app.delete("/admin/booking")
async def admin_delete_booking(login: AdminLogin, booking: Booking):
    if validate_admin_login(login):
        try:
            DB.delete_booking({'id':('=', booking.id)})
        except Exception as e:
            print(e)
            return {"success": False, "msg": "Failed to delete booking"}
        return {"success":True}
    else:
        return {"success": False, "msg": "Invalid auth."}
