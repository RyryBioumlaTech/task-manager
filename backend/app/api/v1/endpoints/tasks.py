from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User

router = APIRouter()

DbDep = Annotated[AsyncSession, Depends(get_db)]


async def _get_owned_task(db: AsyncSession, owner_id: int, task_id: int) -> Task:
    task = await crud.task.get(db, owner_id, task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.get("", response_model=list[schemas.TaskRead])
async def list_tasks(
    db: DbDep,
    current_user: Annotated[User, Depends(get_current_user)],
    date: Annotated[date | None, Query()] = None,
    from_: Annotated[date | None, Query(alias="from")] = None,
    to: Annotated[date | None, Query()] = None,
    tag: Annotated[str | None, Query()] = None,
    done: Annotated[bool | None, Query()] = None,
    overdue: Annotated[bool | None, Query()] = None,
) -> list:
    return await crud.task.get_many(
        db,
        current_user.id,
        date=date,
        from_=from_,
        to=to,
        done=done,
        overdue=overdue,
        tag=tag,
    )


@router.post("", response_model=schemas.TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: schemas.TaskCreate,
    db: DbDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return await crud.task.create(db, current_user.id, data)


@router.get("/{task_id}", response_model=schemas.TaskRead)
async def get_task(task_id: int, db: DbDep, current_user: Annotated[User, Depends(get_current_user)]):
    return await _get_owned_task(db, current_user.id, task_id)


@router.patch("/{task_id}", response_model=schemas.TaskRead)
async def update_task(
    task_id: int,
    data: schemas.TaskUpdate,
    db: DbDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    task = await _get_owned_task(db, current_user.id, task_id)
    return await crud.task.update(db, task, data)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, db: DbDep, current_user: Annotated[User, Depends(get_current_user)]):
    task = await _get_owned_task(db, current_user.id, task_id)
    await crud.task.delete(db, task)
