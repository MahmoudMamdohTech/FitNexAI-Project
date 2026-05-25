"""
FitNex AI — Async Database Layer (SQLAlchemy 2.x + asyncpg)
"""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from config import settings

# engine config for PostgreSQL via asyncpg
_engine_kwargs = {
    "echo": False,
    "pool_size": 5,
    "max_overflow": 10,
    "pool_timeout": 30,
    "pool_recycle": 1800,
    "pool_pre_ping": True,
    "connect_args": {
        "statement_cache_size": 0,        # required for Supabase transaction pooler
        "prepared_statement_cache_size": 0,
    }
}

engine = create_async_engine(settings.DATABASE_URL, **_engine_kwargs)

# session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """Yield a transactional async session, auto-close on exit."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    """Create all tables defined by ORM models."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
