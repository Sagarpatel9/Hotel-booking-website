from enum import Enum
from pydantic import BaseModel, PositiveInt
from typing import Literal, Optional



class RoomTier(str, Enum):
    basic = "basic"
    business = "business"
    vip = "vip"
    

class RoomModel(BaseModel):
    id: Optional[int] = None
    tier: Optional[RoomTier] = None
    capacity: Optional[Literal[1, 2]] = None
    smoking: Optional[int] = None
    kitchen: Optional[int] = None
    price: Optional[float] = None
    number: Optional[PositiveInt] = None

class Booking(BaseModel):
    id: Optional[int] = None
    f_name: Optional[str] = None
    l_name: Optional[str] = None
    address_1: Optional[str] = None
    address_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    checkin_key: Optional[str] = None
    room_id: Optional[int] = None