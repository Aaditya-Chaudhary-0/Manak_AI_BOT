import asyncio
from typing import List
from sentence_transformers import SentenceTransformer
from app.config import settings


class EmbeddingService:
    """
    Service wrapping the BGE-M3 model for generating document and query embeddings.
    """
    def __init__(self) -> None:
        self.model_name = settings.EMBEDDING_MODEL
        self._model = None

    @property
    def model(self) -> SentenceTransformer:
        """
        Lazy-loads the SentenceTransformer model to optimize application startup.
        """
        if self._model is None:
            self._model = SentenceTransformer(self.model_name)
        return self._model

    def _encode_sync(self, texts: List[str]) -> List[List[float]]:
        """
        Synchronously encodes a list of texts and returns normalized embeddings.
        """
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        # Ensure we return list of lists
        return [vec.tolist() for vec in embeddings]

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Asynchronously embeds a list of texts using sentence-transformers.
        Uses asyncio.to_thread to run the CPU-bound encoding task off the main thread.
        """
        if not texts:
            return []
        return await asyncio.to_thread(self._encode_sync, texts)


# Singleton instance
embedding_service = EmbeddingService()
