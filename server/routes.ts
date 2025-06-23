import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { LeaderboardData, RainbetApiResponse } from "@shared/schema";

const RAINBET_API_CONFIG = {
  endpoint: 'https://services.rainbet.com/v1/external/affiliates',
  key: process.env.RAINBET_API_KEY || '78SuhSk2KCMU3S9SRdwdxPBRhSinbNys'
};

const PRIZE_STRUCTURE = [
  10000, 6000, 4000, 2500, 1500, 1000, 500, 300, 200, 100
];

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current leaderboard data
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const competition = await storage.getCurrentCompetition();
      if (!competition) {
        return res.status(404).json({ message: "No active competition found" });
      }

      // Calculate date range for API call
      const startDate = competition.startDate.toISOString().split('T')[0];
      const endDate = competition.endDate.toISOString().split('T')[0];

      // Fetch data from Rainbet API with timeout
      const params = new URLSearchParams({
        start_at: startDate,
        end_at: endDate,
        key: RAINBET_API_CONFIG.key
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${RAINBET_API_CONFIG.endpoint}?${params}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'MarioZip-Leaderboard/1.0',
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Rainbet API error: ${response.status} ${response.statusText}`);
      }

      const apiData = await response.json();
      
      // Transform API data to leaderboard format
      const players = (apiData.players || [])
        .map((player: any, index: number) => ({
          username: player.username || `Player${index + 1}`,
          totalWager: parseFloat(player.total_wager || 0),
          rank: index + 1,
          prize: PRIZE_STRUCTURE[index] || 0
        }))
        .sort((a, b) => b.totalWager - a.totalWager)
        .slice(0, 50); // Limit to top 50

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
        totalPlayers: players.length,
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
          totalPrizePool: competition ? parseFloat(competition.totalPrizePool) : 25000,
          totalPlayers: cachedEntries.length,
          lastUpdated: cachedEntries[0]?.lastUpdated?.toISOString() || new Date().toISOString()
        };
        
        res.json(fallbackData);
      } catch (fallbackError) {
        res.status(500).json({ 
          message: "Failed to fetch leaderboard data",
          error: error instanceof Error ? error.message : "Unknown error"
        });
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
        totalPrizePool: "25000",
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
