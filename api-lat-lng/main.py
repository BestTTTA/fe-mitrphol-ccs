from fastapi import FastAPI
from pydantic import BaseModel
import pickle
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime
from typing import List

app = FastAPI()

data_list = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Data(BaseModel):
    ccs: float
    latitude: float
    longitude: float

@app.post("/log/")
async def add_data(data: Data):
    data_list.append(data.dict())
    return {"message": "Data added successfully!"}

@app.get("/get_data/")
async def get_data():
    return data_list

class InputData(BaseModel):
    ccs: float
    latitude: float
    longitude: float
    



