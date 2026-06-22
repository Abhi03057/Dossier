from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.news import router as news_router
from routes.jobs import router as jobs_router
from routes.github import router as github_router
from routes.analyze import router as analyze_router
from routes.match import router as match_router
from routes.compare import router as compare_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(news_router)
app.include_router(jobs_router)
app.include_router(github_router)
app.include_router(analyze_router)
app.include_router(match_router)
app.include_router(compare_router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Competitive Intel API is running"}
