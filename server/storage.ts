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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let startDate: Date;
    let endDate: Date;
    
    if (now.getDate() >= 25) {
      // Current period: 25th of current month to 25th of next month
      startDate = new Date(currentYear, currentMonth, 25);
      endDate = new Date(currentYear, currentMonth + 1, 25);
    } else {
      // Current period: 25th of previous month to 25th of current month
      startDate = new Date(currentYear, currentMonth - 1, 25);
      endDate = new Date(currentYear, currentMonth, 25);
    }
    
    const competition: Competition = {
      id: this.currentCompetitionId++,
      startDate,
      endDate,
      totalPrizePool: "1000",
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
