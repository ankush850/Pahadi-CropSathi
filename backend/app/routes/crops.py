from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.core.database import get_database
from app.models.crop import CropCreate, CropUpdate, CropResponse

router = APIRouter()


@router.post("/", response_model=CropResponse, status_code=status.HTTP_201_CREATED)
async def create_crop(crop: CropCreate):
    db = get_database()
    crop_dict = crop.model_dump()
    crop_dict["created_at"] = datetime.utcnow()
    crop_dict["updated_at"] = datetime.utcnow()
    result = await db.crops.insert_one(crop_dict)
    created_crop = await db.crops.find_one({"_id": result.inserted_id})
    return created_crop


@router.get("/", response_model=List[CropResponse])
async def get_crops(skip: int = 0, limit: int = 10):
    db = get_database()
    crops = await db.crops.find().skip(skip).limit(limit).to_list(limit)
    return crops


@router.get("/search", response_model=List[CropResponse])
async def search_crops(
    name: Optional[str] = None,
    category: Optional[str] = None,
    planting_season: Optional[str] = None
):
    db = get_database()
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    if planting_season:
        query["planting_season"] = {"$regex": planting_season, "$options": "i"}
    crops = await db.crops.find(query).to_list(100)
    return crops


@router.get("/{crop_id}", response_model=CropResponse)
async def get_crop(crop_id: str):
    db = get_database()
    if not ObjectId.is_valid(crop_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid crop ID"
        )
    crop = await db.crops.find_one({"_id": ObjectId(crop_id)})
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    return crop


@router.put("/{crop_id}", response_model=CropResponse)
async def update_crop(crop_id: str, crop_update: CropUpdate):
    db = get_database()
    if not ObjectId.is_valid(crop_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid crop ID"
        )
    update_data = crop_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    result = await db.crops.update_one(
        {"_id": ObjectId(crop_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    updated_crop = await db.crops.find_one({"_id": ObjectId(crop_id)})
    return updated_crop


@router.delete("/{crop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_crop(crop_id: str):
    db = get_database()
    if not ObjectId.is_valid(crop_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid crop ID"
        )
    result = await db.crops.delete_one({"_id": ObjectId(crop_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
