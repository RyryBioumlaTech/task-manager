from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User

router = APIRouter()

DbDep = Annotated[AsyncSession, Depends(get_db)]


@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: schemas.UserCreate, db: DbDep) -> User:
    existing = await crud.user.get_by_email(db, data.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    return await crud.user.create(db, data, get_password_hash(data.password))


@router.post("/login", response_model=schemas.Token)
async def login(form: Annotated[OAuth2PasswordRequestForm, Depends()], db: DbDep) -> schemas.Token:
    user = await crud.user.get_by_email(db, form.username)
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    subject = str(user.id)
    return schemas.Token(access_token=create_access_token(subject), refresh_token=create_refresh_token(subject))


@router.post("/refresh", response_model=schemas.Token)
async def refresh(refresh_token: str, db: DbDep) -> schemas.Token:
    try:
        payload = decode_token(refresh_token)
        user_id = int(payload.get("sub", ""))
        if payload.get("type") != "refresh":
            raise ValueError
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from None

    user = await crud.user.get_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    subject = str(user.id)
    return schemas.Token(access_token=create_access_token(subject), refresh_token=create_refresh_token(subject))


@router.get("/me", response_model=schemas.UserRead)
async def read_me(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user
