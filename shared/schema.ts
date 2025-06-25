import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  totalWager: numeric("total_wager", { precision: 10, scale: 2 }).notNull(),
  rank: integer("rank").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrizePool: numeric("total_prize_pool", { precision: 10, scale: 2 }).notNull(),
  isActive: text("is_active").notNull().default("true"),
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).omit({
  id: true,
  lastUpdated: true,
});

export const insertCompetitionSchema = createInsertSchema(competitions).omit({
  id: true,
});

export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;

// API Response types
export interface RoobetApiResponse {
  success: boolean;
  data: {
    players: Array<{
      username: string;
      total_wager: number;
    }>;
    total_prize_pool: number;
  };
}

export interface LeaderboardData {
  players: Array<{
    username: string;
    totalWager: number;
    rank: number;
    prize: number;
  }>;
  totalPrizePool: number;
  totalPlayers: number;
  lastUpdated: string;
}
