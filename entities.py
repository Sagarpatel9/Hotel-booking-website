from enum import Enum
from pydantic import BaseModel, PositiveInt



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