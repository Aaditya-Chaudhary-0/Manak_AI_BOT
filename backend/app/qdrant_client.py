import logging
from qdrant_client import QdrantClient, AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams
from app.config import settings

logger = logging.getLogger(__name__)


class QdrantConnectionManager:
    """
    Manages connections and basic operations (health, initialization) for Qdrant Vector DB.
    """
    def __init__(self) -> None:
        self.url = settings.QDRANT_URL
        self.collection_name = settings.QDRANT_COLLECTION
        
        # Instantiate clients (both sync for scripts and async for route handlers)
        self.client = QdrantClient(url=self.url)
        self.async_client = AsyncQdrantClient(url=self.url)

    def check_health(self) -> bool:
        """
        Pings Qdrant to verify connection health.
        """
        try:
            # Retrieve collection list as a light ping
            self.client.get_collections()
            return True
        except Exception as e:
            logger.error(f"Qdrant connection health check failed: {e}")
            return False

    async def check_health_async(self) -> bool:
        """
        Asynchronously pings Qdrant to verify connection health.
        """
        try:
            await self.async_client.get_collections()
            return True
        except Exception as e:
            logger.error(f"Async Qdrant connection health check failed: {e}")
            return False

    def init_collection(self, vector_size: int = 1024, distance: Distance = Distance.COSINE) -> None:
        """
        Helper to initialize the collection if it does not exist.
        """
        try:
            exists = self.client.collection_exists(self.collection_name)
            if not exists:
                logger.info(f"Creating Qdrant collection: {self.collection_name}")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=vector_size, distance=distance),
                )
                
                # Create default payload index on source_type
                logger.info(f"Creating payload index on source_type in {self.collection_name}")
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name="source_type",
                    field_schema="keyword",
                )
                logger.info("Qdrant collection and indices initialized successfully.")
            else:
                logger.info(f"Qdrant collection {self.collection_name} already exists.")
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant collection: {e}")
            raise e


# Export a global instance of the connection manager
qdrant_manager = QdrantConnectionManager()
