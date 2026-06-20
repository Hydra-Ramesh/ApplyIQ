import os
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone

# Load embedding model once
# all-MiniLM-L6-v2 is small and fast, keeping within memory constraints
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_pinecone_index():
    api_key = os.getenv("PINECONE_API_KEY", "mock-pinecone-key")
    pc = Pinecone(api_key=api_key)
    index_name = os.getenv("PINECONE_INDEX_NAME", "resume-ai-index")
    return pc.Index(index_name)

def get_vector_store(namespace: str):
    index = get_pinecone_index()
    return PineconeVectorStore(index=index, embedding=embedding_model, namespace=namespace)
