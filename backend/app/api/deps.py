from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core.config import settings
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:

    try:
        payload = decode_token(token)
        subject = payload.get("sub")
        if subject is None or payload.get("type") != "access":
            raise credentials_exception
        user_id = int(subject)
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception from None

    user = await crud.user.get_by_id(db, user_id)
    if user is None:
        raise credentials_exception
    return user
