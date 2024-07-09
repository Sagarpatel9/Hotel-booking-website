from fastapi import FastAPI
from entities import RoomModel
from search import Search


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
