import os
import jwt
from fastapi import Request, HTTPException
from typing import Dict, Any, Optional
from core.redis_client import redis_cache

JWT_SECRET = os.getenv("JWT_SECRET", "generate_a_very_long_secure_random_string_here")

def get_token_from_request(request: Request) -> Optional[str]:
    # Try header first
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    
    # Try query param (for websockets)
    token_param = request.query_params.get("token")
    if token_param:
        return token_param
        
    return None

def verify_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def check_quota(feature_key: str, max_limit: int):
    """
    Dependency generator for checking quotas based on user tier.
    """
    async def _check(request: Request):
        token = get_token_from_request(request)
        if not token:
            raise HTTPException(status_code=401, detail="Authentication required")
            
        user_data = verify_token(token)
        user_id = user_data.get("id") or user_data.get("userId")
        # Ensure we properly fallback if subscriptionTier is missing
        tier = user_data.get("subscriptionTier", "free")
        is_admin = user_data.get("isAdmin", False)
        
        if tier == "pro" or is_admin:
            # Pro users and admins have no limits
            return user_data
            
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
            
        # For free users, check Redis quota
        redis_key = f"usage:{feature_key}:{user_id}"
        
        # Get current usage
        current_usage = redis_cache.get(redis_key)
        if current_usage is None:
            current_usage = 0
        else:
            current_usage = int(current_usage)
            
        if current_usage >= max_limit:
            raise HTTPException(status_code=403, detail=f"Free limit reached for {feature_key}. Please upgrade to Pro.")
            
        # Increment usage
        redis_cache.incr(redis_key)
        
        return user_data
        
    return _check

def require_pro(request: Request):
    """
    Dependency to strictly require Pro tier.
    """
    token = get_token_from_request(request)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user_data = verify_token(token)
    tier = user_data.get("subscriptionTier", "free")
    is_admin = user_data.get("isAdmin", False)
    
    if tier != "pro" and not is_admin:
        raise HTTPException(status_code=403, detail="This feature requires a Pro subscription.")
        
    return user_data
