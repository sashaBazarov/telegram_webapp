import fastapi
from app.routes import user_routes
from app.instances import app, router
from fastapi.openapi.utils import get_openapi

# Подключаем маршруты
app.include_router(router)

@app.on_event("startup")
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="TestAPI",
        version="1.0.0",
        description="API documentation",
        routes=app.routes,
    )
    openapi_schema["security"] = [{"APIKeyHeader": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
