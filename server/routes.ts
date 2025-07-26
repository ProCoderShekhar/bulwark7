import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { LeaderboardData, RoobetApiResponse } from "@shared/schema";
import axios from "axios";

const ROOBET_API_CONFIG = {
  endpoint: 'https://roobetconnect.com/affiliate/v2/stats',
  userId: '2c7f6672-fd92-479b-9033-9739d913d374',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjN2Y2NjcyLWZkOTItNDc5Yi05MDMzLTk3MzlkOTEzZDM3NCIsIm5vbmNlIjoiMGIxNmYxM2ItYzY1Ny00Mzg2LTg5MWMtZTBiZTMwM2U5OTVjIiwic2VydmljZSI6ImFmZmlsaWF0ZVN0YXRzIiwiaWF0IjoxNzUwODAzNzU0fQ.MM85GRm9fPJ2s_q1e37aWH-BIOhVCuW01nOgFW6-g4E'
};

// Fixed competition dates: July 26 to August 26, 2025
function getCompetitionDates() {
  // Fixed competition period: July 26 to August 26, 2025
  const startDate = new Date(2025, 6, 26); // July 26, 2025 (month is 0-based)
  const endDate = new Date(2025, 7, 26);   // August 26, 2025
  
  // Format as YYYY-MM-DD for API
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}

const PRIZE_STRUCTURE = [
  400, 200, 150, 100, 50, 40, 20, 20, 10, 10
];

// Cache for leaderboard data
let cachedLeaderboardData: LeaderboardData | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Function to fetch affiliate stats from Roobet API
async function fetchAffiliateStats(): Promise<any> {
  const { startDate, endDate } = getCompetitionDates();
  
  console.log(`Fetching Roobet data for period: ${startDate} to ${endDate}`);
  
  try {
    const response = await axios.get(ROOBET_API_CONFIG.endpoint, {
      params: {
        userId: ROOBET_API_CONFIG.userId,
        startDate,
        endDate
      },
      headers: {
        Authorization: `Bearer ${ROOBET_API_CONFIG.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('Roobet API Response:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      console.error('Roobet API request timed out');
    } else if (error.response) {
      console.error('Roobet API error:', error.response.status, error.response.data);
    } else {
      console.error('Roobet API request failed:', error.message);
    }
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current leaderboard data
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const now = Date.now();
      
      // Return cached data if it's still fresh
      if (cachedLeaderboardData && (now - lastFetchTime) < CACHE_DURATION) {
        return res.json(cachedLeaderboardData);
      }

      const competition = await storage.getCurrentCompetition();
      if (!competition) {
        return res.status(404).json({ message: "No active competition found" });
      }

      // Fetch fresh data from Roobet API
      const apiData = await fetchAffiliateStats();
      
      // Transform API data to leaderboard format
      const allPlayers = (Array.isArray(apiData) ? apiData : [])
        .map((player: any) => ({
          username: player.username || 'Unknown',
          totalWager: parseFloat(player.weightedWagered || player.wagered || 0)
        }))
        .sort((a, b) => b.totalWager - a.totalWager);

      // Get top 10 for display with correct rankings and prizes
      const players = allPlayers
        .slice(0, 10)
        .map((player: any, index: number) => {
          const originalUsername = player.username;
          const maskedUsername = originalUsername.substring(0, 3) + '*'.repeat(Math.max(0, originalUsername.length - 3));
          return {
            username: maskedUsername,
            totalWager: player.totalWager,
            rank: index + 1,
            prize: PRIZE_STRUCTURE[index] || 0
          };
        });

      // Update local storage with fresh data
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
        totalPlayers: allPlayers.length, // Show total active players from API
        lastUpdated: new Date().toISOString()
      };

      // Cache the data
      cachedLeaderboardData = leaderboardData;
      lastFetchTime = now;

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
          totalPrizePool: competition ? parseFloat(competition.totalPrizePool) : 1000,
          totalPlayers: cachedEntries.length,
          lastUpdated: cachedEntries[0]?.lastUpdated?.toISOString() || new Date().toISOString()
        };
        
        res.json(fallbackData);
      } catch (fallbackError) {
        // Final fallback with demo data
        const demoData: LeaderboardData = {
          players: [
            { username: "CryptoKing", totalWager: 125000, rank: 1, prize: 400 },
            { username: "SlotMaster", totalWager: 98500, rank: 2, prize: 200 },
            { username: "LuckyPlayer", totalWager: 87200, rank: 3, prize: 150 },
            { username: "BetBeast", totalWager: 76800, rank: 4, prize: 100 },
            { username: "WagerWolf", totalWager: 65400, rank: 5, prize: 50 },
            { username: "RollRoyce", totalWager: 54300, rank: 6, prize: 40 },
            { username: "SpinStar", totalWager: 43200, rank: 7, prize: 20 },
            { username: "CashCow", totalWager: 32100, rank: 8, prize: 20 }
          ],
          totalPrizePool: 1000,
          totalPlayers: 8,
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
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 24);
      
      const newCompetition = await storage.createCompetition({
        startDate: now,
        endDate: nextMonth,
        totalPrizePool: "1000",
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
