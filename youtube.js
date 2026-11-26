const BASE_URL = "https://www.googleapis.com/youtube/v3";
// Leave empty to load videos without an API key, or add a key later if desired
const API_KEY = "";

// Playable videos shown directly without needing an API key
const VIDEOS = [
  {
    id: "jfKfPfyJRdk",
    category: "music",
    views: "1.4M views",
    snippet: {
      title: "lofi hip hop radio 📚 - beats to relax/study to",
      channelTitle: "Lofi Girl",
      publishedAt: "2025-05-12T10:00:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg" } }
    }
  },
  {
    id: "PkZNo7MFNFg",
    category: "coding",
    views: "3.8M views",
    snippet: {
      title: "Learn JavaScript - Full Course for Beginners",
      channelTitle: "freeCodeCamp.org",
      publishedAt: "2024-12-10T14:30:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg" } }
    }
  },
  {
    id: "aqz-KE-bpKQ",
    category: "4k",
    views: "215M views",
    snippet: {
      title: "Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film",
      channelTitle: "Blender",
      publishedAt: "2023-08-20T09:15:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg" } }
    }
  },
  {
    id: "G3e-cpL7ofc",
    category: "coding",
    views: "11.2M views",
    snippet: {
      title: "HTML & CSS Full Course - Beginner to Pro",
      channelTitle: "SuperSimpleDev",
      publishedAt: "2025-02-05T16:45:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/G3e-cpL7ofc/hqdefault.jpg" } }
    }
  },
  {
    id: "LXb3EKWsInQ",
    category: "4k",
    views: "89M views",
    snippet: {
      title: "COSTA RICA IN 4K 60fps HDR (ULTRA HD)",
      channelTitle: "Jacob + Katie Schwarz",
      publishedAt: "2024-06-18T12:00:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/LXb3EKWsInQ/hqdefault.jpg" } }
    }
  },
  {
    id: "4xDzrJKXOOY",
    category: "music",
    views: "920K views",
    snippet: {
      title: "synthwave radio 🌌 - beats to chill/game to",
      channelTitle: "Lofi Girl",
      publishedAt: "2025-09-01T18:20:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg" } }
    }
  },
  {
    id: "8mAITcNt710",
    category: "science",
    views: "14.5M views",
    snippet: {
      title: "Harvard CS50 – Full Computer Science University Course",
      channelTitle: "freeCodeCamp.org",
      publishedAt: "2024-11-15T11:10:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/8mAITcNt710/hqdefault.jpg" } }
    }
  },
  {
    id: "M7lc1UVf-VE",
    category: "tech",
    views: "4.1M views",
    snippet: {
      title: "YouTube Developers Live: Embedded Player Demo",
      channelTitle: "Google for Developers",
      publishedAt: "2024-07-22T08:00:00Z",
      thumbnails: { high: { url: "https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg" } }
    }
  }
];

// DOM Elements
const videoGrid = document.getElementById("video-grid");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const playerSection = document.getElementById("player-section");
const videoPlayer = document.getElementById("video-player");
const playerTitle = document.getElementById("player-title");
const playerChannel = document.getElementById("player-channel");
const closePlayerBtn = document.getElementById("close-player-btn");
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const homeLogo = document.getElementById("home-logo");

// Load videos immediately on page open
window.addEventListener("DOMContentLoaded", () => {
  loadVideos("trending");
});

// Load videos from API if key exists, otherwise use local list
async function loadVideos(query) {
  if (!API_KEY) {
    filterLocalVideos(query);
    return;
  }

  try {
    videoGrid.innerHTML = "<p style='color:#aaa;'>Loading videos...</p>";
    const url =
      query === "trending"
        ? `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=16&key=${API_KEY}`
        : `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=16&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.items) {
      throw new Error(data.error?.message || "No items");
    }

    renderVideos(data.items, query !== "trending");
  } catch (err) {
    filterLocalVideos(query);
  }
}

// Filter local videos by search term or category
function filterLocalVideos(query) {
  if (query === "trending") {
    renderVideos(VIDEOS, false);
    return;
  }

  const q = query.toLowerCase();
  const filtered = VIDEOS.filter(
    (v) =>
      v.snippet.title.toLowerCase().includes(q) ||
      v.snippet.channelTitle.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
  );

  renderVideos(filtered.length > 0 ? filtered : VIDEOS, false);
}

// Render video cards into the grid
function renderVideos(videos, isSearchResult) {
  videoGrid.innerHTML = "";

  videos.forEach((video) => {
    const videoId = isSearchResult ? video.id?.videoId : video.id;
    if (!videoId) return;

    const { title, channelTitle, thumbnails, publishedAt } = video.snippet;
    const thumbnailUrl = thumbnails?.high?.url || thumbnails?.medium?.url || "";
    const formattedDate = new Date(publishedAt).toLocaleDateString();
    const channelInitial = channelTitle ? channelTitle.charAt(0).toUpperCase() : "Y";

    let viewsLabel = video.views ? `${video.views} • ` : "";
    if (video.statistics?.viewCount) {
      viewsLabel = `${formatViews(video.statistics.viewCount)} views • `;
    }

    const card = document.createElement("div");
    card.classList.add("video-card");

    card.innerHTML = `
      <div class="thumb-wrapper">
        <img
          src="${thumbnailUrl}"
          alt="${title}"
          class="thumbnail"
          onerror="this.onerror=null; this.src='https://placehold.co/480x270/272727/ffffff?text=Video';"
        >
      </div>
      <div class="video-info">
        <div class="channel-badge">${channelInitial}</div>
        <div>
          <h3 class="video-title">${title}</h3>
          <p class="channel-name">${channelTitle}</p>
          <p class="video-stats">${viewsLabel}${formattedDate}</p>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      playVideo(videoId, title, channelTitle);
    });

    videoGrid.appendChild(card);
  });
}

// Format view count (1.5K, 2.3M)
function formatViews(num) {
  const n = Number(num);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

// Play selected video inside the embedded player
function playVideo(videoId, title, channelTitle) {
  videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  playerTitle.textContent = title;
  playerChannel.textContent = channelTitle;
  playerSection.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Close embedded player
closePlayerBtn.addEventListener("click", () => {
  videoPlayer.src = "";
  playerSection.classList.add("hidden");
});

// Search submit handler
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    loadVideos(query);
  }
});

// Sidebar and category chip clicks
document.querySelectorAll(".sidebar-item, .chip").forEach((el) => {
  el.addEventListener("click", () => {
    document.querySelectorAll(".sidebar-item, .chip").forEach((i) => i.classList.remove("active"));
    el.classList.add("active");
    loadVideos(el.getAttribute("data-query"));
  });
});

// Reset feed on logo click
homeLogo.addEventListener("click", () => {
  searchInput.value = "";
  loadVideos("trending");
});

// Toggle sidebar width
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});