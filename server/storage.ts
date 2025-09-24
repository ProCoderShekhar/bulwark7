import { 
  leaderboardEntries, 
  competitions,
  type LeaderboardEntry, 
  type InsertLeaderboardEntry,
  type Competition,
  type InsertCompetition
} from "@shared/schema";

export interface IStorage {
  // Leaderboard methods
  getLeaderboardEntries(): Promise<LeaderboardEntry[]>;
  updateLeaderboardEntries(entries: InsertLeaderboardEntry[]): Promise<void>;
  
  // Competition methods
  getCurrentCompetition(): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: number, competition: Partial<Competition>): Promise<Competition>;
}

export class MemStorage implements IStorage {
  private leaderboardEntries: Map<number, LeaderboardEntry>;
  private competitions: Map<number, Competition>;
  private currentLeaderboardId: number;
  private currentCompetitionId: number;

  constructor() {
    this.leaderboardEntries = new Map();
    this.competitions = new Map();
    this.currentLeaderboardId = 1;
    this.currentCompetitionId = 1;
    
    // Initialize with current competition
    this.initializeCurrentCompetition();
  }

  private initializeCurrentCompetition() {
    // Fixed competition period for Bulwark7 launch:
    // September 23, 2025 to October 14, 2025 (21 days)
    const startDate = new Date(2025, 8, 23); // month is 0-based (8 = September)
    const endDate = new Date(2025, 9, 14);   // 9 = October
    
    const competition: Competition = {
      id: this.currentCompetitionId++,
      startDate,
      endDate,
      totalPrizePool: "1500",
      isActive: "true"
    };
    
    this.competitions.set(competition.id, competition);
  }

  async getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboardEntries.values())
      .sort((a, b) => b.rank - a.rank);
  }

  async updateLeaderboardEntries(entries: InsertLeaderboardEntry[]): Promise<void> {
    this.leaderboardEntries.clear();
    
    entries.forEach(entry => {
      const leaderboardEntry: LeaderboardEntry = {
        ...entry,
        id: this.currentLeaderboardId++,
        lastUpdated: new Date(),
      };
      this.leaderboardEntries.set(leaderboardEntry.id, leaderboardEntry);
    });
  }

  async getCurrentCompetition(): Promise<Competition | undefined> {
    return Array.from(this.competitions.values())
      .find(comp => comp.isActive === "true");
  }

  async createCompetition(insertCompetition: InsertCompetition): Promise<Competition> {
    const competition: Competition = {
      ...insertCompetition,
      id: this.currentCompetitionId++,
      isActive: insertCompetition.isActive || "true",
    };
    this.competitions.set(competition.id, competition);
    return competition;
  }

  async updateCompetition(id: number, updates: Partial<Competition>): Promise<Competition> {
    const existing = this.competitions.get(id);
    if (!existing) {
      throw new Error(`Competition with id ${id} not found`);
    }
    
    const updated: Competition = { ...existing, ...updates };
    this.competitions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
