import os
import re
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# --- config ---
TMDB_TOKEN = os.getenv("TMDB_TOKEN")  # TMDB v4 Read Access Token
TMDB_BASE = "https://api.themoviedb.org/3"

# --- Flask app ---
app = Flask(__name__)
CORS(app)

# Keep one session (keep-alive)
session = requests.Session()
session.headers.update({
    "accept": "application/json",
    "Authorization": f"Bearer {TMDB_TOKEN}",
})


# --- matching helpers (title-only) ---
def _normalize(s: str) -> str:
    s = s.lower().replace("’", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def _similarity(a: str, b: str) -> float:
    # Jaccard over token sets
    A, B = set(_normalize(a).split()), set(_normalize(b).split())
    if not A and not B:
        return 1.0
    inter = len(A & B)
    union = len(A | B)
    return (inter / union) if union else 0.0


def _pick_best(results: List[Dict[str, Any]], title: str) -> Optional[Dict[str, Any]]:
    best, best_score = None, float("-inf")
    for res in results:
        names = [res.get("title"), res.get("original_title")]
        title_score = max((_similarity(title, n) for n in names if n), default=0.0)
        popularity_bonus = 0.05 if (res.get("vote_count") or 0) > 500 else 0.0
        score = title_score + popularity_bonus
        if score > best_score:
            best, best_score = res, score
    return best


# --- TMDB client (sync) ---
def tmdb_search_movie(title: str, *, language: str) -> List[Dict[str, Any]]:
    params = {"query": title, "include_adult": "false", "page": 1, "language": language}
    res = session.get(f"{TMDB_BASE}/search/movie", params=params, timeout=15)
    if not res.ok:
        return []
    data = res.json()
    return data.get("results") or []


def match_one(title: str, *, language: str) -> Dict[str, Any]:
    clean = title.strip()
    hits = tmdb_search_movie(clean, language=language)
    best = _pick_best(hits, clean)

    out: Dict[str, Any] = {
        "input_title": title,
        "title": None,
        "tmdb_id": None,
        "release_year": None,
        # include a compact list of alternative candidates for UI disambiguation
        "candidates": [],
    }

    # prepare compact candidates (top 5)
    compact_candidates: List[Dict[str, Any]] = []
    for res in (hits or [])[:5]:
        rd = res.get("release_date")
        year = int(rd[:4]) if isinstance(rd, str) and len(rd) >= 4 and rd[:4].isdigit() else None
        compact_candidates.append({
            "title": res.get("title"),
            "tmdb_id": res.get("id"),
            "release_year": year,
        })
    out["candidates"] = compact_candidates

    if not best:
        return out

    out["title"] = best.get("title")
    out["tmdb_id"] = best.get("id")
    rd = best.get("release_date")
    if isinstance(rd, str) and len(rd) >= 4 and rd[:4].isdigit():
        out["release_year"] = int(rd[:4])

    return out


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


@app.route("/tmdb/match", methods=["POST", "OPTIONS"])
def tmdb_match():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(force=True, silent=True) or {}
    queries = data.get("queries")

    if not isinstance(queries, list) or not queries:
        return jsonify({"error": "queries must be a non-empty list"}), 400

    # Support both [{ "title": "..." }, ...] and ["...", ...]
    titles: List[str] = []
    for q in queries:
        if isinstance(q, dict) and isinstance(q.get("title"), str):
            titles.append(q["title"])
        else:
            titles.append(str(q))

    language = data.get("language") or "en-US"
    try:
        limit = max(1, min(int(data.get("concurrency", 10)), 50))
    except Exception:
        limit = 10

    # Run with bounded concurrency; order preserved by executor.map
    with ThreadPoolExecutor(max_workers=limit) as ex:
        results = list(ex.map(lambda t: match_one(t, language=language), titles))

    return jsonify({"matches": results})


if __name__ == "__main__":
    # simple dev server that just listens; no uvicorn
    app.run(host="0.0.0.0", port=3001, debug=True)
