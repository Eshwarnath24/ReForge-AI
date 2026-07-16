import os
import requests
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def build_search_query(detected_items: list) -> str:
    item_names = [item.get("item", "") for item in detected_items]
    return " ".join(item_names) + " upcycle DIY project"


def search_youtube_videos(detected_items: list, max_results: int = 5):
    if not YOUTUBE_API_KEY:
        print("YOUTUBE_API_KEY not set — skipping YouTube search")
        return []

    query = build_search_query(detected_items)

    try:
        search_url = "https://www.googleapis.com/youtube/v3/search"
        search_params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": max_results,
            "key": YOUTUBE_API_KEY,
        }
        search_res = requests.get(search_url, params=search_params, timeout=15)
        if not search_res.ok:
            print(f"YouTube search failed: {search_res.status_code} {search_res.text}")
            return []

        search_data = search_res.json()
        video_ids = [item["id"]["videoId"] for item in search_data.get("items", [])]
        if not video_ids:
            return []

        stats_url = "https://www.googleapis.com/youtube/v3/videos"
        stats_params = {
            "part": "snippet,statistics",
            "id": ",".join(video_ids),
            "key": YOUTUBE_API_KEY,
        }
        stats_res = requests.get(stats_url, params=stats_params, timeout=15)
        if not stats_res.ok:
            print(f"YouTube stats failed: {stats_res.status_code} {stats_res.text}")
            return []

        stats_data = stats_res.json()

        candidates = []
        for video in stats_data.get("items", []):
            snippet = video.get("snippet", {})
            stats = video.get("statistics", {})
            candidates.append({
                "source": "youtube_video",
                "video_id": video["id"],
                "title": snippet.get("title", "Untitled"),
                "channel": snippet.get("channelTitle", "Unknown"),
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
                "view_count": int(stats.get("viewCount", 0)),
                "like_count": int(stats.get("likeCount", 0)),
                "url": f"https://www.youtube.com/watch?v={video['id']}",
            })

        return candidates

    except Exception as e:
        print(f"YouTube search error (non-fatal): {e}")
        return []