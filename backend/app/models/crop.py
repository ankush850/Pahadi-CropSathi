from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")
        return schema


class CropBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    scientific_name: Optional[str] = None
    category: str
    description: Optional[str] = None
    planting_season: str
    harvest_season: str
    water_requirement: Optional[str] = None
    soil_type: Optional[str] = None


class CropCreate(CropBase):
    pass


class CropUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    scientific_name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    planting_season: Optional[str] = None
    harvest_season: Optional[str] = None
    water_requirement: Optional[str] = None
    soil_type: Optional[str] = None


class CropResponse(CropBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
