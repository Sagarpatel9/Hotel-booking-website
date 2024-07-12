from enum import Enum
from pydantic import BaseModel, PositiveInt
from typing import Optional



class RoomTier(str, Enum):
    basic = "basic"
    business = "business"
    vip = "vip"
    

class RoomModel(BaseModel):
    tier: Optional[RoomTier] = None
    capacity: Optional[PositiveInt] = None
    kitchen: Optional[bool] = None
    smoking: Optional[bool] = None
    price: Optional[float] = None