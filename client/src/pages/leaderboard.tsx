import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountdownTimer } from '@/components/countdown-timer';
import { LeaderboardCard } from '@/components/leaderboard-card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Trophy, TrendingUp, Clock, Users } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { SocialLinks } from '@/components/social-links';
import BrandLogo from '@/components/brand-logo';
import { TopThreePodium } from '@/components/top-three-podium';
import type { LeaderboardData } from '@shared/schema';

const BRAND_NAME = "Bulwark7";
const STAKE_COM_URL = "https://stake.com/?c=d245abdd90&offer=bul";
const STAKE_US_URL = "https://stake.us/?offer=bul&c=d245abdd90";

export default function LeaderboardPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const { 
    data: leaderboardData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<LeaderboardData>({
    queryKey: [
      `/api/leaderboard?source=all`
    ],
    refetchInterval: 30000,
  });

  const { data: competitionData } = useQuery<any>({
    queryKey: ['/api/competition'],
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (leaderboardData?.lastUpdated) {
      setLastUpdated(new Date(leaderboardData.lastUpdated).toLocaleTimeString());
    }
  }, [leaderboardData]);

  const handleCountdownReset = () => {
    refetch();
  };

  const competitionLabel = competitionData?.startDate && competitionData?.endDate
    ? `${new Date(competitionData.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(competitionData.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
    : undefined;

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 loading-shimmer">
          <div className="flex items-center space-x-6">
            <Skeleton className="w-16 h-16 rounded-full bg-slate-700/50" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 bg-slate-700/50 rounded w-1/3" />
              <Skeleton className="h-4 bg-slate-700/50 rounded w-1/4" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-6 bg-slate-700/50 rounded w-24" />
              <Skeleton className="h-4 bg-slate-700/50 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <div className="glass-card rounded-2xl p-8 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-slate-50 mb-2">Unable to Load Data</h3>
      <p className="text-slate-400 mb-6">
        Failed to load leaderboard data. Please try again.
      </p>
      <button 
        onClick={() => refetch()}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <BrandLogo />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-50">{BRAND_NAME}</h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">Stake Wager Competition</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <a 
                href={STAKE_US_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 glass-card-hover text-xs sm:text-sm"
              >
                🇺🇸 Stake.us • Code BUL
              </a>
              <a 
                href={STAKE_COM_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 glass-card-hover text-xs sm:text-sm"
              >
                🌐 Stake.com • Code BUL
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-2 sm:px-4 sm:py-2 mb-6 sm:mb-8">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-blue-400">Live Competition</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-slate-50">Stake</span>
            <span className="prize-text"> Wager Leaderboard</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
            Compete over 21 days across Stake.com and Stake.us. Top 10 share $3,000.
          </p>

          <CountdownTimer 
            targetDate={competitionData?.endDate ? new Date(competitionData.endDate) : undefined}
            onReset={handleCountdownReset}
            label={competitionLabel}
          />
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="glass-card-hover rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold prize-text mb-1">
                {formatCurrency(leaderboardData?.totalPrizePool || 3000)}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">Total Prize Pool</p>
            </div>
            
            <div className="glass-card-hover rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-50 mb-1">
                {formatNumber(leaderboardData?.totalPlayers || 0)}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">Active Players</p>
            </div>
            
            <div className="glass-card-hover rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
              <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-50 mb-1">
                {lastUpdated || 'Live'}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">Last Updated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-50">Current Rankings</h2>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-slate-400">Live Data • Merged</span>
              </div>
            </div>
          </div>

          {isLoading && <LoadingSkeleton />}
          {error && <ErrorState />}
          
          {leaderboardData && (
            <>
              {/* Top 3 Podium */}
              {leaderboardData.players.length > 0 && (
                <TopThreePodium players={leaderboardData.players} />
              )}

              {/* Full Rankings */}
              <div className="space-y-4">
                {/* Existing players from API */}
                {leaderboardData.players.slice(3).map((player) => (
                  <LeaderboardCard 
                    key={player.rank} 
                    player={player}
                    isTopThree={false}
                  />
                ))}
                
                {/* Placeholder entries to fill up to 10 total */}
                {Array.from({ length: Math.max(0, 10 - leaderboardData.players.length) }, (_, index) => {
                  const rank = leaderboardData.players.length + index + 1;
                  const placeholderPlayer = {
                    username: "---",
                    totalWager: 0,
                    rank: rank,
                    prize: rank <= 10 ? [1500, 750, 300, 150, 50, 50, 50, 50, 50, 50][rank - 1] : 0
                  };
                  return (
                    <LeaderboardCard 
                      key={`placeholder-${rank}`} 
                      player={placeholderPlayer}
                      isTopThree={false}
                    />
                  );
                })}
              </div>

              {/* Empty State */}
              {leaderboardData.players.length === 0 && (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-50 mb-2">
                    Competition Starting Soon
                  </h3>
                  <p className="text-slate-400">
                    Be among the first to join and compete for the top spot!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-6 sm:p-8 border-l-4 border-yellow-500">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0 mt-1" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-50 mb-2">
                    IMPORTANT update to the Affiliate System
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Implemented in September 2025, Stake has changed the way that Affiliate leaderboards are operated.
                    They have enforced a WEIGHTED system, meaning the type of game you play will affect where you rank on races and raffles.
                  </p>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2">
                    <span className="font-semibold text-yellow-500">Please note</span> — This ONLY applies to the affiliate benefits (leaderboards and raffles) and has no bearing on any of your benefits directly by Stake or related to your gameplay on Stake.
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50">
                  <div className="grid grid-cols-2 bg-slate-800/50 p-3 text-xs sm:text-sm font-semibold text-slate-200">
                    <div>RTP Condition</div>
                    <div>Counted Toward Affiliate Wagers</div>
                  </div>
                  <div className="divide-y divide-slate-700/50">
                    <div className="grid grid-cols-2 p-3 text-xs sm:text-sm text-slate-400">
                      <div>RTP ≤ 98%</div>
                      <div>100% of wagered amount counts</div>
                    </div>
                    <div className="grid grid-cols-2 p-3 text-xs sm:text-sm text-slate-400">
                      <div>RTP &gt; 98%</div>
                      <div>50% of wagered amount counts</div>
                    </div>
                    <div className="grid grid-cols-2 p-3 text-xs sm:text-sm text-slate-400">
                      <div>RTP ≥ 99%</div>
                      <div>10% of wagered amount counts</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Notes</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We understand this is a frustrating change which does complicate things a shade, but it is now a standard across any affiliate leaderboard on Stake. If they change it back to the $1 for $1 model, we will be the first to shift back to that.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-2">
                    Any other concerns or if you need clarification, please contact Bulwark7 directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 lg:py-16 mt-12 sm:mt-16 lg:mt-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            
            {/* Brand + Socials */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-3 sm:mb-4">
                <BrandLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                <h4 className="text-lg sm:text-xl font-bold text-slate-50">{BRAND_NAME}</h4>
              </div>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Competitive Stake wagering. Join and climb the ranks for real prizes.
              </p>
              <div className="mt-4">
                <SocialLinks 
                  xUrl="https://x.com/Bulwark77" 
                  discordUrl="https://discord.com/invite/PSJ4HnJdH6" 
                  kickUrl="https://kick.com/bulwark7" 
                />
              </div>
            </div>

            {/* Referral Links */}
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-semibold text-slate-50 mb-3 sm:mb-4">Sign Up</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={STAKE_US_URL} target="_blank" rel="noopener noreferrer" className="social-link text-slate-200">Stake.us — Code BUL</a>
                <a href={STAKE_COM_URL} target="_blank" rel="noopener noreferrer" className="social-link text-slate-200">Stake.com — Code BUL</a>
              </div>
            </div>

            {/* Competition Info */}
            <div className="text-center sm:text-left lg:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold text-slate-50 mb-3 sm:mb-4">Competition</h4>
              <div className="space-y-2 text-xs sm:text-sm text-slate-400">
                <p>
                  Period: <span className="text-slate-300">
                    {competitionData?.startDate && competitionData?.endDate
                      ? `${new Date(competitionData.startDate).toLocaleDateString()} - ${new Date(competitionData.endDate).toLocaleDateString()}`
                      : 'Sep 23 - Oct 14'
                    }
                  </span>
                </p>
                <p>
                  Reset: <span className="text-slate-300">Manual (no auto reset)</span>
                </p>
                <p>
                  Prize Pool: <span className="text-blue-400 font-semibold">
                    {formatCurrency(leaderboardData?.totalPrizePool || 3000)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/50 mt-8 pt-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
              <p>© 2025 Bulwark7. All rights reserved.</p>
              <p className="text-slate-600">Play responsibly. 21+ (US), 18+ (elsewhere)</p>
              <p className="text-slate-600">
                <a 
                  href="https://nobitadev.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Made with 💗 by Nobita
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
