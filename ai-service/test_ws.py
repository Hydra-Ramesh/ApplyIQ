import asyncio
import websockets
import json

async def test():
    uri = "ws://127.0.0.1:8000/api/v1/resume/ws/live-analysis"
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps({
            "tex_code": "My latex resume",
            "job_description": "We need a software engineer"
        }))
        while True:
            response = await websocket.recv()
            data = json.loads(response)
            print(f"Received: {data['type']}")
            if data['type'] in ('roast_end', 'ats_end'):
                break

asyncio.run(test())
