import httpx
from fastapi import HTTPException

async def fetch_tiki_product(tiki_id: str) -> dict:
    url = f"https://tiki.vn/api/v2/products/{tiki_id}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Product not found on Tiki or blocked.")
            
        data = response.json()
        
        return {
            "name": data.get("name"),
            "url": f"https://tiki.vn/product-p{tiki_id}.html",
            "current_price": data.get("price")
        }
