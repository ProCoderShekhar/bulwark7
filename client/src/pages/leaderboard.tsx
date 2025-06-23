import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountdownTimer } from '@/components/countdown-timer';
import { LeaderboardCard } from '@/components/leaderboard-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Twitter, MessageCircle, Youtube, Instagram, Trophy, Crown, Medal, TrendingUp, Clock, Users } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { LeaderboardData } from '@shared/schema';

const MARIOZIP_LOGO = "https://media.discordapp.net/attachments/1386288409823281172/1386483110518063206/895EF406-D865-4B53-97E6-156A6B337425.jpg?ex=6859de85&is=68588d05&hm=fa208b8338dc0ab7846ff8a40728b720bec96d5f6e3296f08f0c7cfc68bda28b&=&format=png";
const RAINBET_LOGO = "https://media.discordapp.net/attachments/1386288409823281172/1386379643355140167/IMG_9629.jpg?ex=685a26e8&is=6858d568&hm=d7c48a18a565375e280cc3abc9554513d2664a79cd1b9be4ea03db4f17924779&=&format=png";

export default function LeaderboardPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const { 
    data: leaderboardData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<LeaderboardData>({
    queryKey: ['/api/leaderboard'],
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
        Failed to connect to Rainbet API. Please check your connection and try again.
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
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={MARIOZIP_LOGO}
                alt="MarioZip" 
                className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-50">MarioZip</h1>
                <p className="text-sm text-slate-400">Wager Competition</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://rainbet.com/?r=mariozip" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Play Now
              </a>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-400">Powered by</span>
                <img 
                  src={RAINBET_LOGO}
                  alt="Rainbet" 
                  className="h-8 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Live Competition</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-slate-50">Wager</span>
            <span className="prize-text"> Leaderboard</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Compete with the best players and climb to the top. 
            Monthly competitions with massive prize pools.
          </p>

          <CountdownTimer 
            targetDate={competitionData?.endDate ? new Date(competitionData.endDate) : undefined}
            onReset={handleCountdownReset}
          />
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card-hover rounded-2xl p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold prize-text mb-1">
                {formatCurrency(leaderboardData?.totalPrizePool || 25000)}
              </div>
              <p className="text-slate-400">Total Prize Pool</p>
            </div>
            
            <div className="glass-card-hover rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-50 mb-1">
                {formatNumber(leaderboardData?.totalPlayers || 0)}
              </div>
              <p className="text-slate-400">Active Players</p>
            </div>
            
            <div className="glass-card-hover rounded-2xl p-6 text-center">
              <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-lg font-bold text-slate-50 mb-1">
                {lastUpdated || 'Live'}
              </div>
              <p className="text-slate-400">Last Updated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-50">Current Rankings</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Live Data</span>
            </div>
          </div>

          {isLoading && <LoadingSkeleton />}
          {error && <ErrorState />}
          
          {leaderboardData && (
            <>
              {/* Top 3 Podium */}
              {leaderboardData.players.length >= 3 && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-slate-50 mb-6 text-center">Top Performers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {leaderboardData.players.slice(0, 3).map((player) => (
                      <LeaderboardCard 
                        key={player.rank} 
                        player={player} 
                        isTopThree={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Full Rankings */}
              <div className="space-y-4">
                {leaderboardData.players.slice(3).map((player) => (
                  <LeaderboardCard 
                    key={player.rank} 
                    player={player}
                    isTopThree={false}
                  />
                ))}
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

      {/* Footer */}
      <footer className="py-16 mt-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={MARIOZIP_LOGO}
                  alt="MarioZip" 
                  className="w-10 h-10 rounded-full border border-blue-500/50 object-cover"
                />
                <h4 className="text-xl font-bold text-slate-50">MarioZip</h4>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The premier destination for competitive wagering. 
                Join thousands of players competing for substantial prizes.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-slate-50 mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://x.com/mariozip7" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://discord.gg/scsTmr55" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://kick.com/mariozip" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/mariozip7/" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              <div className="mt-4">
                <a href="https://rainbet.com/?r=mariozip" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  <img src={RAINBET_LOGO} alt="Rainbet" className="w-4 h-4 object-contain" />
                  <span>Play on Rainbet</span>
                </a>
              </div>
            </div>

            {/* Competition Info */}
            <div>
              <h4 className="text-lg font-semibold text-slate-50 mb-4">Competition</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>
                  Period: <span className="text-slate-300">
                    {competitionData?.startDate && competitionData?.endDate
                      ? `${new Date(competitionData.startDate).toLocaleDateString()} - ${new Date(competitionData.endDate).toLocaleDateString()}`
                      : 'June 23 - July 23'
                    }
                  </span>
                </p>
                <p>
                  Reset: <span className="text-slate-300">Monthly on 24th</span>
                </p>
                <p>
                  Prize Pool: <span className="text-blue-400 font-semibold">
                    {formatCurrency(leaderboardData?.totalPrizePool || 25000)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/50 mt-12 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2024 MarioZip. All rights reserved. • 
              <span className="text-blue-400"> Powered by Rainbet</span> • 
              Play responsibly. 18+
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
