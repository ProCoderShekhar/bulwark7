import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountdownTimer } from '@/components/countdown-timer';
import { LeaderboardCard } from '@/components/leaderboard-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ExternalLink, Twitter, MessageCircle, Youtube, Instagram } from 'lucide-react';
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
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: competitionData } = useQuery({
    queryKey: ['/api/competition'],
    refetchInterval: 60000, // Refresh every minute
  });

  useEffect(() => {
    if (leaderboardData?.lastUpdated) {
      setLastUpdated(new Date(leaderboardData.lastUpdated).toLocaleTimeString());
    }
  }, [leaderboardData]);

  const handleCountdownReset = () => {
    // Trigger a refetch when countdown reaches zero
    refetch();
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="gaming-card rounded-xl p-6 relative overflow-hidden">
          <div className="loading-shimmer absolute inset-0"></div>
          <div className="flex items-center space-x-6">
            <Skeleton className="w-12 h-12 rounded-full bg-gaming-metallic/30" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 bg-gaming-metallic/30 rounded w-1/4" />
              <Skeleton className="h-3 bg-gaming-metallic/30 rounded w-1/3" />
            </div>
            <Skeleton className="h-6 bg-gaming-metallic/30 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <Card className="gaming-card gaming-glow">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h3 className="text-xl font-rajdhani font-bold text-gaming-off-white">
            Unable to load leaderboard
          </h3>
        </div>
        <p className="text-gaming-metallic mb-4">
          Failed to fetch data from the Rainbet API. Please check your connection and try again.
        </p>
        <button 
          onClick={() => refetch()}
          className="px-6 py-2 bg-gaming-accent text-gaming-dark-slate font-rajdhani font-semibold rounded-lg hover:bg-gaming-secondary transition-colors"
        >
          Retry
        </button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gaming-dark-slate text-gaming-off-white">
      {/* Header */}
      <header className="w-full border-b border-gaming-accent/20 bg-gradient-to-r from-gaming-primary/20 to-gaming-secondary/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={MARIOZIP_LOGO}
                alt="MarioZip Logo" 
                className="w-12 h-12 rounded-full border-2 border-gaming-accent gaming-glow object-cover"
              />
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-gaming-accent">MarioZip</h1>
                <p className="text-sm text-gaming-metallic font-rajdhani">Wager Competition</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gaming-metallic font-rajdhani">Sponsored by</span>
              <img 
                src={RAINBET_LOGO}
                alt="Rainbet Logo" 
                className="h-8 object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 bg-gradient-to-b from-transparent to-gaming-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-gaming-accent to-gaming-secondary mb-4">
            WAGER LEADERBOARD
          </h2>
          <p className="text-xl text-gaming-metallic font-rajdhani mb-8">
            Compete for the top spot • Monthly resets on the 24th
          </p>
          
          <CountdownTimer 
            targetDate={competitionData?.endDate ? new Date(competitionData.endDate) : undefined}
            onReset={handleCountdownReset}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Prize Pool */}
          <div className="gaming-card gaming-glow rounded-2xl p-6 mb-12 text-center">
            <h3 className="text-2xl font-orbitron font-bold text-gaming-accent mb-4">Total Prize Pool</h3>
            <div className="text-5xl font-orbitron font-black prize-glow text-gaming-secondary mb-2">
              {formatCurrency(leaderboardData?.totalPrizePool || 25000)}
            </div>
            <p className="text-gaming-metallic font-rajdhani">Distributed among top 10 players</p>
          </div>

          {/* Leaderboard Header */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-orbitron font-bold text-gaming-accent">Current Rankings</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gaming-metallic font-rajdhani">Last updated:</span>
              <span className="text-gaming-accent font-rajdhani font-semibold">
                {lastUpdated || 'Live'}
              </span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          {isLoading && <LoadingSkeleton />}
          {error && <ErrorState />}
          
          {leaderboardData && (
            <div className="space-y-4">
              {/* Top 3 Special Cards */}
              {leaderboardData.players.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {leaderboardData.players.slice(0, 3).map((player) => (
                    <LeaderboardCard 
                      key={player.rank} 
                      player={player} 
                      isTopThree={true}
                    />
                  ))}
                </div>
              )}

              {/* Remaining Rankings */}
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
                <div className="gaming-card gaming-glow rounded-xl p-12 text-center">
                  <h3 className="text-xl font-rajdhani font-bold text-gaming-off-white mb-2">
                    No players yet
                  </h3>
                  <p className="text-gaming-metallic">
                    Be the first to join the competition!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-gradient-to-t from-gaming-primary/20 to-transparent border-t border-gaming-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            
            {/* MarioZip Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <img 
                  src={MARIOZIP_LOGO}
                  alt="MarioZip Logo" 
                  className="w-10 h-10 rounded-full border border-gaming-accent object-cover"
                />
                <h4 className="text-xl font-orbitron font-bold text-gaming-accent">MarioZip</h4>
              </div>
              <p className="text-gaming-metallic font-rajdhani">
                The ultimate wager competition platform. 
                <br />Play responsibly and may the odds be in your favor.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="text-center">
              <h4 className="text-lg font-rajdhani font-bold text-gaming-accent mb-4">Follow MarioZip</h4>
              <div className="flex justify-center space-x-6">
                <a 
                  href="#" 
                  className="gaming-card p-3 rounded-lg gaming-glow-hover text-gaming-accent hover:text-gaming-secondary transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="gaming-card p-3 rounded-lg gaming-glow-hover text-gaming-accent hover:text-gaming-secondary transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="gaming-card p-3 rounded-lg gaming-glow-hover text-gaming-accent hover:text-gaming-secondary transition-colors"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="gaming-card p-3 rounded-lg gaming-glow-hover text-gaming-accent hover:text-gaming-secondary transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Competition Info */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-rajdhani font-bold text-gaming-accent mb-4">Competition Details</h4>
              <div className="space-y-2 text-sm text-gaming-metallic font-rajdhani">
                <p>
                  Current Period: <span className="text-gaming-accent">
                    {competitionData?.startDate && competitionData?.endDate
                      ? `${new Date(competitionData.startDate).toLocaleDateString()} - ${new Date(competitionData.endDate).toLocaleDateString()}`
                      : 'June 24 - July 24'
                    }
                  </span>
                </p>
                <p>
                  Total Players: <span className="text-gaming-accent">
                    {formatNumber(leaderboardData?.totalPlayers || 0)}
                  </span>
                </p>
                <p>
                  Next Reset: <span className="text-gaming-accent">
                    {competitionData?.endDate 
                      ? new Date(competitionData.endDate).toLocaleDateString()
                      : 'July 24, 2024'
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gaming-accent/20 mt-8 pt-8 text-center">
            <p className="text-gaming-metallic text-sm font-rajdhani">
              © 2024 MarioZip. All rights reserved. | 
              <span className="text-gaming-accent"> Sponsored by Rainbet</span> | 
              Gamble responsibly. 18+
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
