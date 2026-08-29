import os
import sys

# Add the parent directory of this script's directory to python path
# to enable direct execution without requiring -m app.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.qdrant_client import qdrant_manager


def main() -> None:
    """
    Initializes Qdrant collections and payload indices.
    """
    print("Starting Qdrant collection initialization...")
    try:
        # Check connection first
        if not qdrant_manager.check_health():
            print("ERROR: Qdrant client connection verification failed. Make sure Qdrant is running.")
            sys.exit(1)
            
        print(f"Connected to Qdrant at {qdrant_manager.url}.")
        qdrant_manager.init_collection()
        print("Qdrant collection setup finished successfully!")
    except Exception as e:
        print(f"ERROR: Failed to initialize Qdrant collections: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
