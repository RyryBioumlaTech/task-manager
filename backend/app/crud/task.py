from datetime import UTC, date, datetime

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def create(db: AsyncSession, owner_id: int, data: TaskCreate) -> Task:
    task = Task(owner_id=owner_id, **data.model_dump())
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def get(db: AsyncSession, owner_id: int, task_id: int) -> Task | None:
    result = await db.execute(select(Task).where(Task.id == task_id, Task.owner_id == owner_id))
    return result.scalar_one_or_none()


def _apply_tag_filter(tasks: list[Task], tag: str | None) -> list[Task]:
    if tag is None:
        return tasks
    return [task for task in tasks if tag in task.tags]


async def get_many(
    db: AsyncSession,
    owner_id: int,
    *,
    date: date | None = None,
    from_: date | None = None,
    to: date | None = None,
    done: bool | None = None,
    overdue: bool | None = None,
    tag: str | None = None,
) -> list[Task]:
    conditions = [Task.owner_id == owner_id]
    if date is not None:
        conditions.append(Task.due_date == date)
    if from_ is not None:
        conditions.append(Task.due_date >= from_)
    if to is not None:
        conditions.append(Task.due_date <= to)
    if done is not None:
        conditions.append(Task.done == done)
    if overdue is not None:
        today = datetime.now(UTC).date()
        if overdue:
            conditions.append(Task.due_date < today)
            conditions.append(Task.done == False)  # noqa: E712
        else:
            conditions.append(or_(Task.due_date.is_(None), Task.due_date >= today, Task.done == True))  # noqa: E712

    stmt = select(Task).where(and_(*conditions)).order_by(Task.due_date.is_(None), Task.due_date)
    result = await db.execute(stmt)
    tasks = list(result.scalars().all())

    return _apply_tag_filter(tasks, tag)


async def update(db: AsyncSession, task: Task, data: TaskUpdate) -> Task:
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    await db.commit()
    await db.refresh(task)
    return task


async def delete(db: AsyncSession, task: Task) -> None:
    await db.delete(task)
    await db.commit()
