from fastapi.testclient import TestClient


def test_register_and_login(client: TestClient) -> None:
    resp = client.post("/api/v1/auth/register", json={"email": "user@example.com", "password": "secret123"})
    assert resp.status_code == 201
    assert resp.json()["email"] == "user@example.com"
    assert "password" not in resp.json()

    login = client.post("/api/v1/auth/login", data={"username": "user@example.com", "password": "secret123"})
    assert login.status_code == 200
    body = login.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]


def test_register_duplicate_email(client: TestClient) -> None:
    payload = {"email": "dup@example.com", "password": "secret123"}
    assert client.post("/api/v1/auth/register", json=payload).status_code == 201
    assert client.post("/api/v1/auth/register", json=payload).status_code == 409


def test_login_wrong_password(client: TestClient) -> None:
    client.post("/api/v1/auth/register", json={"email": "wrong@example.com", "password": "secret123"})
    resp = client.post("/api/v1/auth/login", data={"username": "wrong@example.com", "password": "nope12345"})
    assert resp.status_code == 401


def test_me_with_token(client: TestClient) -> None:
    client.post("/api/v1/auth/register", json={"email": "me@example.com", "password": "secret123"})
    login = client.post("/api/v1/auth/login", data={"username": "me@example.com", "password": "secret123"})
    token = login.json()["access_token"]
    resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "me@example.com"


def test_me_without_token(client: TestClient) -> None:
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401


def test_refresh_token_flow(client: TestClient) -> None:
    client.post("/api/v1/auth/register", json={"email": "refresh@example.com", "password": "secret123"})
    login = client.post("/api/v1/auth/login", data={"username": "refresh@example.com", "password": "secret123"})
    refresh_token = login.json()["refresh_token"]
    resp = client.post("/api/v1/auth/refresh", params={"refresh_token": refresh_token})
    assert resp.status_code == 200
    assert resp.json()["access_token"]
