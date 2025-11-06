import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { LeaderboardData } from "@shared/schema";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Prize distribution for Bulwark7 (total $3,000)
// 1: $1500, 2: $750, 3: $300, 4: $150, 5-10: $50
const PRIZE_STRUCTURE = [1500, 750, 300, 150, 50, 50, 50, 50, 50, 50];

// In-memory JSON DB-like cache (per source), refreshed hourly
type SourceKey = "all" | "com" | "us";
const HOURLY_MS = 60 * 60 * 1000;
interface SourceSnapshot {
  rawPlayers: Array<{ username: string; totalWager: number }>;
  lastUpdated: number;
}
const hourlyCache: Record<SourceKey, SourceSnapshot> = {
  all: { rawPlayers: [], lastUpdated: 0 },
  com: { rawPlayers: [], lastUpdated: 0 },
  us: { rawPlayers: [], lastUpdated: 0 },
};

// Snapshot file on disk
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "data");
const snapshotFile = path.resolve(dataDir, "leaderboard.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create data dir", e);
  }
}

function loadSnapshotFromDisk() {
  try {
    if (fs.existsSync(snapshotFile)) {
      const raw = fs.readFileSync(snapshotFile, "utf8");
      const parsed = JSON.parse(raw) as Record<SourceKey, SourceSnapshot>;
      ( ["all","com","us"] as const ).forEach((k) => {
        if (parsed?.[k]?.rawPlayers) hourlyCache[k] = parsed[k];
      });
      console.log("Loaded leaderboard snapshot from disk");
    }
  } catch (e) {
    console.error("Failed to load leaderboard snapshot", e);
  }
}

function saveSnapshotToDisk() {
  try {
    ensureDataDir();
    const payload = JSON.stringify(hourlyCache, null, 2);
    fs.writeFileSync(snapshotFile, payload, "utf8");
    console.log("Saved leaderboard snapshot to", snapshotFile);
  } catch (e) {
    console.error("Failed to save leaderboard snapshot", e);
  }
}

// Google Sheets configuration (defaults based on provided links)
const SHEET_COM_ID = process.env.SHEET_COM_ID || "1KLiTUs90DQYfGBE8UCoW5qhqSeC21_MDzh1_cjkISVU";
const SHEET_US_ID = process.env.SHEET_US_ID || "1wi1i6mecmKHJ2J3G_k3p02KXYWIX_H3X9WVe-ADVbFo";

// External Sheet-to-JSON service
const SHEETTOJSON_BASE = process.env.SHEETTOJSON_BASE || "https://sheettojson.replit.app";

function safeParseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.\-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function maskUsername(username: string): string {
  const trimmed = (username || "").toString();
  if (trimmed.length <= 3) return trimmed + "***";
  return trimmed.substring(0, 3) + "*".repeat(Math.max(3, trimmed.length - 3));
}

async function fetchPlayersFromSheet(sheetId: string): Promise<Array<{ username: string; totalWager: number }>> {
  // Prefer external service to avoid brittle GViz parsing; default to first sheet
  const url = `${SHEETTOJSON_BASE}/api/sheet?id=${encodeURIComponent(sheetId)}`;
  const resp = await axios.get(url, { timeout: 15000 });
  const payload = resp.data;

  // Expected shape:
  // { error: boolean, data: { sheets: [{ headers: string[], data: Array<Record<string,string|number>> }] } }
  const firstSheet = payload?.data?.sheets?.[0];
  const rows: Array<Record<string, any>> = firstSheet?.data || [];
  if (!Array.isArray(rows) || rows.length === 0) return [];

  // Determine keys from first non-empty row
  const sample = rows.find((r) => r && Object.keys(r).length > 0) || rows[0] || {};
  const keys = Object.keys(sample).map((k) => ({ orig: k, lc: k.toLowerCase() }));

  // Prefer user_name or keys containing 'user' for username (avoid affiliate_name)
  let usernameKey: string | undefined =
    keys.find(k => k.lc === "user_name")?.orig ||
    keys.find(k => k.lc === "username")?.orig ||
    keys.find(k => k.lc.includes("user"))?.orig ||
    keys.find(k => (k.lc.endsWith("_name") || k.lc === "name") && !k.lc.includes("affiliate") && !k.lc.includes("campaign"))?.orig;

  // Find wager key, prefer weighted, else wagered, else any contains 'wager'
  let wagerKey: string | undefined =
    keys.find(k => k.lc.includes("weighted") && k.lc.includes("wager"))?.orig ||
    keys.find(k => k.lc === "wagered")?.orig ||
    keys.find(k => k.lc.includes("wager"))?.orig;

  if (!usernameKey || !wagerKey) {
    throw new Error("Could not locate username/wager columns in sheet JSON");
  }

  const players: Array<{ username: string; totalWager: number }> = [];
  for (const row of rows) {
    const usernameRaw = row?.[usernameKey];
    const wagerRaw = row?.[wagerKey];
    const username = (usernameRaw ?? "").toString().trim();
    const totalWager = safeParseNumber(wagerRaw);
    if (!username || !isFinite(totalWager)) continue;
    players.push({ username, totalWager });
  }
  return players;
}

async function fetchAggregatedPlayers(source: SourceKey): Promise<Array<{ username: string; totalWager: number }>> {
  if (source === "com") {
    return await fetchPlayersFromSheet(SHEET_COM_ID).catch(() => []);
  }
  if (source === "us") {
    return await fetchPlayersFromSheet(SHEET_US_ID).catch(() => []);
  }
  // all
  const [comPlayers, usPlayers] = await Promise.all([
    fetchPlayersFromSheet(SHEET_COM_ID).catch(() => []),
    fetchPlayersFromSheet(SHEET_US_ID).catch(() => []),
  ]);

  const totals = new Map<string, number>();
  const record = (p: { username: string; totalWager: number }) => {
    const key = p.username.trim();
    const prev = totals.get(key) || 0;
    totals.set(key, prev + (p.totalWager || 0));
  };
  comPlayers.forEach(record);
  usPlayers.forEach(record);

  return Array.from(totals.entries()).map(([username, totalWager]) => ({ username, totalWager }));
}

async function refreshSource(source: SourceKey): Promise<void> {
  const list = await fetchAggregatedPlayers(source);
  hourlyCache[source] = {
    rawPlayers: list,
    lastUpdated: Date.now(),
  };
}

async function refreshAllSources(): Promise<void> {
  await Promise.all([refreshSource("com"), refreshSource("us")]);
  // Aggregate after com/us are ready
  const totals = new Map<string, number>();
  for (const src of ["com", "us"] as const) {
    for (const p of hourlyCache[src].rawPlayers) {
      const prev = totals.get(p.username) || 0;
      totals.set(p.username, prev + p.totalWager);
    }
  }
  hourlyCache.all = {
    rawPlayers: Array.from(totals.entries()).map(([username, totalWager]) => ({ username, totalWager })),
    lastUpdated: Date.now(),
  };
  saveSnapshotToDisk();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize cache on startup and schedule hourly refresh
  ensureDataDir();
  loadSnapshotFromDisk();
  refreshAllSources().catch((e) => console.error("Initial refresh failed", e));
  setInterval(() => {
    refreshAllSources().catch((e) => console.error("Hourly refresh failed", e));
  }, HOURLY_MS);
  
  // Get current leaderboard data
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const sourceParam = (req.query.source as string | undefined)?.toLowerCase();
      const source: SourceKey = sourceParam === "us" ? "us" : sourceParam === "com" ? "com" : "all";

      const competition = await storage.getCurrentCompetition();
      if (!competition) {
        return res.status(404).json({ message: "No active competition found" });
      }

      // Use hourly snapshot; if empty, perform an on-demand refresh for resiliency
      let aggregated = hourlyCache[source]?.rawPlayers || [];
      if (!aggregated || aggregated.length === 0) {
        aggregated = await fetchAggregatedPlayers(source);
        hourlyCache[source] = { rawPlayers: aggregated, lastUpdated: Date.now() };
        saveSnapshotToDisk();
      }
      const allPlayers = aggregated
        .map((p) => ({ username: p.username || "Unknown", totalWager: Number(p.totalWager) || 0 }))
        .filter((p) => !!p.username)
        .sort((a, b) => b.totalWager - a.totalWager);

      // Get top 10 for display with correct rankings and prizes
      const players = allPlayers
        .slice(0, 10)
        .map((player: any, index: number) => {
          const maskedUsername = maskUsername(player.username);
          return {
            username: maskedUsername,
            totalWager: player.totalWager,
            rank: index + 1,
            prize: PRIZE_STRUCTURE[index] || 0
          };
        });

      // Update local storage snapshot (for diagnostics/fallbacks)
      await storage.updateLeaderboardEntries(
        players.map((p: any) => ({
          username: p.username,
          totalWager: p.totalWager.toString(),
          rank: p.rank
        }))
      );

      const leaderboardData: LeaderboardData = {
        players,
        totalPrizePool: parseFloat(competition.totalPrizePool),
        totalPlayers: allPlayers.length,
        lastUpdated: new Date().toISOString()
      };

      res.json(leaderboardData);
      
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      
      // Fallback to cached data if API fails
      try {
        const cachedEntries = await storage.getLeaderboardEntries();
        const competition = await storage.getCurrentCompetition();
        
        const fallbackData: LeaderboardData = {
          players: cachedEntries.map(entry => ({
            username: entry.username,
            totalWager: parseFloat(entry.totalWager),
            rank: entry.rank,
            prize: PRIZE_STRUCTURE[entry.rank - 1] || 0
          })),
          totalPrizePool: competition ? parseFloat(competition.totalPrizePool) : 3000,
          totalPlayers: cachedEntries.length,
          lastUpdated: cachedEntries[0]?.lastUpdated?.toISOString() || new Date().toISOString()
        };
        
        res.json(fallbackData);
      } catch (fallbackError) {
        // Final fallback with demo data
        const demoData: LeaderboardData = {
          players: [
            { username: "User***", totalWager: 250000, rank: 1, prize: 1500 },
            { username: "Player***", totalWager: 198500, rank: 2, prize: 750 },
            { username: "Anon***", totalWager: 157200, rank: 3, prize: 300 },
            { username: "High***", totalWager: 126800, rank: 4, prize: 150 },
            { username: "Wager***", totalWager: 105400, rank: 5, prize: 50 },
            { username: "Spin***", totalWager: 94300, rank: 6, prize: 50 },
            { username: "Bet***", totalWager: 83200, rank: 7, prize: 50 },
            { username: "Roll***", totalWager: 72100, rank: 8, prize: 50 },
            { username: "Jackpot***", totalWager: 61000, rank: 9, prize: 50 },
            { username: "Winner***", totalWager: 50000, rank: 10, prize: 50 }
          ],
          totalPrizePool: 3000,
          totalPlayers: 10,
          lastUpdated: new Date().toISOString()
        };
        
        res.json(demoData);
      }
    }
  });

  // Get current competition info
  app.get("/api/competition", async (req, res) => {
    try {
      const competition = await storage.getCurrentCompetition();
      if (!competition) {
        return res.status(404).json({ message: "No active competition found" });
      }

      res.json({
        id: competition.id,
        startDate: competition.startDate.toISOString(),
        endDate: competition.endDate.toISOString(),
        totalPrizePool: parseFloat(competition.totalPrizePool),
        isActive: competition.isActive === "true"
      });
      
    } catch (error) {
      console.error('Error fetching competition:', error);
      res.status(500).json({ 
        message: "Failed to fetch competition data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Reset competition (for testing or manual reset)
  app.post("/api/competition/reset", async (req, res) => {
    try {
      // End current competition
      const currentCompetition = await storage.getCurrentCompetition();
      if (currentCompetition) {
        await storage.updateCompetition(currentCompetition.id, { isActive: "false" });
      }

      // Create new competition
      // Create a new 21-day competition starting today
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21);
      const newCompetition = await storage.createCompetition({
        startDate: now,
        endDate: end,
        totalPrizePool: "1500",
        isActive: "true"
      });

      // Clear leaderboard
      await storage.updateLeaderboardEntries([]);

      res.json({ 
        message: "Competition reset successfully",
        competition: newCompetition
      });
      
    } catch (error) {
      console.error('Error resetting competition:', error);
      res.status(500).json({ 
        message: "Failed to reset competition",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
