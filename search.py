import json
from typing import Any
from entities import RoomModel

class Search:
    """
    Narrows searches current list of room types
    """
    def __init__(self):
        self.data:list[dict[str, Any]] = json.load(fp:=open("rooms.json"))
        fp.close()

    def narrow(self, parameter: str, value: Any):
        if value is not None:
            for r_n in range(len(self.data)):
                room = self.data[r_n]
                if room[parameter] != value:
                    self.data[r_n] = None
        self.data = [d for d in self.data if d is not None]