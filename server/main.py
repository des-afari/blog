from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # REMOVE IN PRODUCTION
from api.api_v1 import api_router

app = FastAPI()

origins = [
    'http://localhost',
    'http://localhost:5173'
] # REMOVE IN PRODUCTION

# REMOVE IN PRODUCTION
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/', status_code=200)
async def root():
    return {"message": "connection established"}

app.include_router(api_router, prefix='/api/v1')