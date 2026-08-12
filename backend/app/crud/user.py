from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreate


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email.lower()))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, user_id: int) -> User | None:
    return await db.get(User, user_id)


async def create(db: AsyncSession, data: UserCreate, hashed_password: str) -> User:
    user = User(email=data.email.lower(), hashed_password=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
