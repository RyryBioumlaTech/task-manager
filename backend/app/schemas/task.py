from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    due_date: date | None = None
    tags: list[str] = []


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    due_date: date | None = None
    done: bool | None = None
    tags: list[str] | None = None


class TaskRead(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    done: bool
    created_at: datetime
    updated_at: datetime
