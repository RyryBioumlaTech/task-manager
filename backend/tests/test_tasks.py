from datetime import date, timedelta

from fastapi.testclient import TestClient


def _register(client: TestClient, email: str) -> str:
    client.post("/api/v1/auth/register", json={"email": email, "password": "secret123"})
    login = client.post("/api/v1/auth/login", data={"username": email, "password": "secret123"})
    return login.json()["access_token"]


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _create(client: TestClient, token: str, payload: dict) -> dict:
    resp = client.post("/api/v1/tasks", json=payload, headers=_auth(token))
    assert resp.status_code == 201, resp.text
    return resp.json()


def test_create_and_list(client: TestClient) -> None:
    token = _register(client, "tasks@example.com")
    created = _create(client, token, {"title": "Buy milk", "description": "or Oatly", "tags": ["shopping"]})
    assert isinstance(created["owner_id"], int)
    assert created["done"] is False
    assert created["tags"] == ["shopping"]

    listing = client.get("/api/v1/tasks", headers=_auth(token))
    assert listing.status_code == 200
    body = listing.json()
    assert len(body) == 1
    assert body[0]["title"] == "Buy milk"


def test_get_patch_delete(client: TestClient) -> None:
    token = _register(client, "crud@example.com")
    task_id = _create(client, token, {"title": "Task A"})["id"]

    get = client.get(f"/api/v1/tasks/{task_id}", headers=_auth(token))
    assert get.status_code == 200

    patch = client.patch(
        f"/api/v1/tasks/{task_id}",
        json={"title": "Task A2", "done": True, "tags": ["x", "y"]},
        headers=_auth(token),
    )
    assert patch.status_code == 200
    assert patch.json()["title"] == "Task A2"
    assert patch.json()["done"] is True
    assert patch.json()["tags"] == ["x", "y"]

    delete = client.delete(f"/api/v1/tasks/{task_id}", headers=_auth(token))
    assert delete.status_code == 204
    assert client.get(f"/api/v1/tasks/{task_id}", headers=_auth(token)).status_code == 404


def test_delete_missing_is_404(client: TestClient) -> None:
    token = _register(client, "missing@example.com")
    assert client.delete("/api/v1/tasks/999", headers=_auth(token)).status_code == 404
    assert client.patch("/api/v1/tasks/999", json={"title": "x"}, headers=_auth(token)).status_code == 404


def test_cross_user_isolation(client: TestClient) -> None:
    token_a = _register(client, "a@example.com")
    token_b = _register(client, "b@example.com")
    task_id = _create(client, token_a, {"title": "A secret"})["id"]

    assert client.get(f"/api/v1/tasks/{task_id}", headers=_auth(token_b)).status_code == 404
    assert client.patch(f"/api/v1/tasks/{task_id}", json={"title": "hijack"}, headers=_auth(token_b)).status_code == 404
    assert client.delete(f"/api/v1/tasks/{task_id}", headers=_auth(token_b)).status_code == 404

    assert client.get(f"/api/v1/tasks/{task_id}", headers=_auth(token_a)).status_code == 200


def test_requires_auth(client: TestClient) -> None:
    assert client.get("/api/v1/tasks").status_code == 401
    assert client.post("/api/v1/tasks", json={"title": "x"}).status_code == 401


def test_filter_by_date(client: TestClient) -> None:
    token = _register(client, "date@example.com")
    today = date.today().isoformat()
    future = (date.today() + timedelta(days=3)).isoformat()
    _create(client, token, {"title": "Today task", "due_date": today})
    _create(client, token, {"title": "Future task", "due_date": future})

    only_today = client.get(f"/api/v1/tasks?date={today}", headers=_auth(token))
    titles = [t["title"] for t in only_today.json()]
    assert titles == ["Today task"]

    ranged = client.get(f"/api/v1/tasks?from={today}&to={future}", headers=_auth(token))
    assert len(ranged.json()) == 2


def test_filter_done_and_overdue(client: TestClient) -> None:
    token = _register(client, "state@example.com")
    past = (date.today() - timedelta(days=1)).isoformat()
    _create(client, token, {"title": "Overdue open", "due_date": past})
    done_task = _create(client, token, {"title": "Overdue done", "due_date": past})
    client.patch(f"/api/v1/tasks/{done_task['id']}", json={"done": True}, headers=_auth(token))

    overdue = client.get("/api/v1/tasks?overdue=true", headers=_auth(token)).json()
    assert [t["title"] for t in overdue] == ["Overdue open"]

    not_overdue = client.get("/api/v1/tasks?overdue=false", headers=_auth(token)).json()
    assert [t["title"] for t in not_overdue] == ["Overdue done"]

    done_only = client.get("/api/v1/tasks?done=true", headers=_auth(token)).json()
    assert [t["title"] for t in done_only] == ["Overdue done"]


def test_filter_by_tag(client: TestClient) -> None:
    token = _register(client, "tag@example.com")
    _create(client, token, {"title": "Work", "tags": ["work"]})
    _create(client, token, {"title": "Home", "tags": ["home"]})

    filtered = client.get("/api/v1/tasks?tag=home", headers=_auth(token)).json()
    assert [t["title"] for t in filtered] == ["Home"]
