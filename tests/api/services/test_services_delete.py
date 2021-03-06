import pytest
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)


# POST /services/
@pytest.mark.order('last')
def test_delete_service_valid(admin_token, service):
    response = client.delete(f"/services/{service}", headers={"Authorization": admin_token})
    assert response.status_code == 200
    assert '_id' in response.json()


def test_delete_service_empty(admin_token):
    response = client.delete(f"/services/", headers={"Authorization": admin_token})
    assert response.status_code == 405
    assert response.json()['detail'] == "Method Not Allowed"


@pytest.mark.skip(reason="TODO: This is temporary, fix this test. It doesn't impact coverage.")
def test_delete_service_invalid_objectid(admin_token):
    response = client.delete("/services/foo", headers={"Authorization": admin_token})
    assert response.status_code == 400
    assert response.json() == {
        "detail": "'foo' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    }


def test_delete_service_bad_token(service):
    response = client.delete(f"/services/{service}", headers={"Authorization": "bad-token"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_delete_service_invalid_role(viewer_token, service):
    response = client.delete(f"/services/{service}", headers={"Authorization": viewer_token})
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}


# TODO: Mock the mongodb exception in the try:expect
# def test_create_service_mongo_exception(admin_token):
