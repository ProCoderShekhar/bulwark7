import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountdownTimer } from '@/components/countdown-timer';
import { LeaderboardCard } from '@/components/leaderboard-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Twitter, MessageCircle, Youtube, Instagram, Trophy, Crown, Medal, TrendingUp, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { LeaderboardData } from '@shared/schema';

const MARIOZIP_LOGO = "https://i.ibb.co/gZHh6BV3/895-EF406-D865-4-B53-97-E6-156-A6-B337425.png";
const ROOBET_LOGO = "https://i.ibb.co/C3Jq2wJB/IMG-9399.png";

export default function LeaderboardPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showRules, setShowRules] = useState(false);
  const [rulesExpanded, setRulesExpanded] = useState(false);

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
    <div className="min-h-screen bg-slate-950">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src={MARIOZIP_LOGO}
                alt="MarioZip" 
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500 bg-blue-600 flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-sm sm:text-lg">MZ</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-50">MarioZip</h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">Wager Competition</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a 
                href="https://roobet.com/?ref=mariozip" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 glass-card-hover text-sm sm:text-base"
              >
                <span className="sm:hidden">Play</span>
                <span className="hidden sm:inline">🎰 Play Now</span>
              </a>
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-slate-400">Powered by</span>
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                  <img 
                    src={ROOBET_LOGO}
                    alt="Roobet" 
                    className="w-5 h-5 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-white font-bold text-sm">ROOBET</span>
                </div>
              </div>
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
            <span className="text-slate-50">Wager</span>
            <span className="prize-text"> Leaderboard</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
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
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="glass-card-hover rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold prize-text mb-1">
                {formatCurrency(leaderboardData?.totalPrizePool || 1000)}
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
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-50">Current Rankings</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-slate-400">Live Data</span>
            </div>
          </div>

          {isLoading && <LoadingSkeleton />}
          {error && <ErrorState />}
          
          {leaderboardData && (
            <>
              {/* Top 3 Podium */}
              {leaderboardData.players.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-slate-50 mb-6 text-center">Top Performers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 2nd Place */}
                    {leaderboardData.players[1] && (
                      <div className="md:order-1 flex justify-center">
                        <div className="w-full max-w-sm">
                          <div className="glass-card border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-slate-400/10">
                            <div className="text-center mb-4">
                              <div className="relative inline-block">
                                <Medal className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                              </div>
                              <h3 className="text-xl font-bold text-slate-200 mb-1">{leaderboardData.players[1].username}</h3>
                              <p className="text-2xl font-bold text-slate-300">{formatCurrency(leaderboardData.players[1].totalWager)}</p>
                              <p className="text-sm text-slate-500 mt-1">Prize: ${leaderboardData.players[1].prize}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 1st Place - Center */}
                    {leaderboardData.players[0] && (
                      <div className="md:order-2 flex justify-center">
                        <div className="w-full max-w-sm">
                          <div className="glass-card border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-blue-600/20 to-blue-900/40 backdrop-blur-xl rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl"></div>
                            <div className="relative z-10 text-center mb-4">
                              <div className="relative inline-block">
                                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-3 drop-shadow-lg" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-sm font-bold text-black shadow-lg">1</div>
                              </div>
                              <h3 className="text-2xl font-bold text-yellow-300 mb-2">{leaderboardData.players[0].username}</h3>
                              <p className="text-3xl font-bold text-white mb-1">{formatCurrency(leaderboardData.players[0].totalWager)}</p>
                              <p className="text-lg text-yellow-200 font-semibold">Prize: ${leaderboardData.players[0].prize}</p>
                              <div className="mt-3 px-4 py-1 bg-yellow-500/20 rounded-full">
                                <span className="text-sm text-yellow-300 font-medium">👑 CHAMPION</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {leaderboardData.players[2] && (
                      <div className="md:order-3 flex justify-center">
                        <div className="w-full max-w-sm">
                          <div className="glass-card border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-slate-400/10">
                            <div className="text-center mb-4">
                              <div className="relative inline-block">
                                <Medal className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                              </div>
                              <h3 className="text-xl font-bold text-slate-200 mb-1">{leaderboardData.players[2].username}</h3>
                              <p className="text-2xl font-bold text-slate-300">{formatCurrency(leaderboardData.players[2].totalWager)}</p>
                              <p className="text-sm text-slate-500 mt-1">Prize: ${leaderboardData.players[2].prize}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                    prize: rank <= 10 ? [400, 200, 150, 100, 50, 40, 20, 20, 10, 10][rank - 1] : 0
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

      {/* Rules Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-card rounded-2xl p-8">
            <button
              onClick={() => setRulesExpanded(!rulesExpanded)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-2xl font-bold text-slate-50">Competition Rules & Guidelines</h3>
              {rulesExpanded ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>
            
            {rulesExpanded && (
              <div className="mt-6 space-y-6 text-slate-300">
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">📅 Competition Period</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Monthly competitions run from the 25th of each month to the 25th of the following month</li>
                    <li>• Current competition: July 25, 2025 - August 25, 2025</li>
                    <li>• Leaderboard resets automatically at the start of each new competition</li>
                    <li>• Winners are announced within 48 hours of competition end</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">🎮 Eligible Games & Weighted Wagering</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Slot & House Games Only:</strong> Only wagers on slots and house games count towards the leaderboard (Dice is excluded)</li>
                    <li>• <strong>RTP ≤ 97%:</strong> 100% weight (full wager amount counts)</li>
                    <li>• <strong>RTP 97.01% - 97.99%:</strong> 50% weight (half wager amount counts)</li>
                    <li>• <strong>RTP ≥ 98%:</strong> 10% weight (only 10% of wager amount counts)</li>
                    <li>• Sports betting, live casino, and table games are excluded</li>
                    <li>• Weighted wagering prevents abuse of high-RTP games</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">🏆 Prize Structure</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div className="text-center p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg border border-yellow-500/30">
                      <div className="font-bold text-yellow-400">1st Place</div>
                      <div className="text-2xl font-bold text-white">$400</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-slate-400/20 to-slate-500/10 rounded-lg border border-slate-400/30">
                      <div className="font-bold text-slate-300">2nd Place</div>
                      <div className="text-xl font-bold text-white">$200</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-amber-600/20 to-amber-700/10 rounded-lg border border-amber-600/30">
                      <div className="font-bold text-amber-400">3rd Place</div>
                      <div className="text-xl font-bold text-white">$150</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-500/30">
                      <div className="font-bold text-blue-400">4th Place</div>
                      <div className="text-lg font-bold text-white">$100</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg border border-cyan-500/30">
                      <div className="font-bold text-cyan-400">5th Place</div>
                      <div className="text-lg font-bold text-white">$50</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-sm text-slate-400">
                    6th: $40 • 7th-8th: $20 each • 9th-10th: $10 each • Total Pool: $1,000
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">📋 Rules & Fair Play</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• One account per person - multi-accounting will result in disqualification</li>
                    <li>• Minimum total wager of $100 required to qualify for prizes</li>
                    <li>• All wagering must be done through the MarioZip referral link</li>
                    <li>• Bonuses and promotional funds count toward wagering requirements</li>
                    <li>• Disputes must be submitted within 7 days of competition end</li>
                    <li>• MarioZip reserves the right to verify all wagering activity</li>
                    <li>• Winners must respond within 14 days to claim prizes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">💰 Prize Distribution</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Prizes are distributed in cryptocurrency (Bitcoin or Ethereum)</li>
                    <li>• Winners will be contacted via their registered Roobet email</li>
                    <li>• Prize distribution typically occurs within 72 hours of verification</li>
                    <li>• Minimum withdrawal amount may apply based on network fees</li>
                    <li>• Tax responsibilities lie with the individual winner</li>
                  </ul>
                </div>

                <div className="text-center pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500">
                    By participating, you agree to these terms and conditions. 
                    MarioZip promotes responsible gambling. Please play within your means.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 lg:py-16 mt-12 sm:mt-16 lg:mt-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-3 sm:mb-4">
                <img 
                  src={MARIOZIP_LOGO}
                  alt="MarioZip" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-blue-500/50 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-blue-500/50 bg-blue-600 flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-xs sm:text-sm">MZ</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-50">MarioZip</h4>
              </div>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                The premier destination for competitive wagering. 
                Join thousands of players competing for substantial prizes.
              </p>
            </div>

            {/* Social Links */}
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-semibold text-slate-50 mb-3 sm:mb-4">Connect</h4>
              <div className="flex justify-center sm:justify-start space-x-4">
                <a href="https://x.com/mariozip7" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://discord.gg/scsTmr55" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://kick.com/mariozip" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://www.instagram.com/mariozip7/" target="_blank" rel="noopener noreferrer" className="social-link text-slate-400 hover:text-blue-400">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
              <div className="mt-4">
                <a href="https://roobet.com/?ref=mariozip" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  <img 
                    src={ROOBET_LOGO}
                    alt="Roobet" 
                    className="w-4 h-4 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded" style={{display: 'none'}}></div>
                  <span>Play on Roobet</span>
                </a>
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
                      : 'June 25 - July 25'
                    }
                  </span>
                </p>
                <p>
                  Reset: <span className="text-slate-300">Monthly on 25th</span>
                </p>
                <p>
                  Prize Pool: <span className="text-blue-400 font-semibold">
                    {formatCurrency(leaderboardData?.totalPrizePool || 1000)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Rules Section - Collapsible */}
          <div className="border-t border-slate-800/50 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setShowRules(!showRules)}
                className="w-full flex items-center justify-between p-3 sm:p-4 glass-card rounded-lg hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-50">Competition Rules & Weighted Wager System</h3>
                </div>
                {showRules ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {showRules && (
                <div className="mt-4 glass-card rounded-lg p-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-300 mb-6">
                        Your wagers on Roobet will count towards the leaderboard at the following weights based on the games you are playing. 
                        This helps prevent leaderboard abuse:
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center space-x-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-green-400 text-sm">100% Weight</div>
                          <div className="text-slate-300 text-sm">Games with an RTP of 97% or less will contribute 100% of the amount wagered to the leaderboard.</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-yellow-400 text-sm">50% Weight</div>
                          <div className="text-slate-300 text-sm">Games with an RTP above 97% will contribute 50% of the amount wagered to the leaderboard.</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-red-400 text-sm">10% Weight</div>
                          <div className="text-slate-300 text-sm">Games with an RTP of 98% and above will contribute 10% of the amount wagered to the leaderboard.</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-blue-400 mb-2 text-sm">Important Notes</div>
                          <ul className="text-slate-300 space-y-1 text-sm">
                            <li>• Only Slots and Housegames count (dice is excluded)</li>
                            <li>• Leaderboard updates every 5 minutes</li>
                            <li>• Competition runs from June 25th to July 25th</li>
                            <li>• Monthly resets occur on the 25th of each month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/50 mt-8 pt-8 text-center space-y-2">
            <p className="text-slate-500 text-sm">
              © 2025 MarioZip. All rights reserved. • 
              <span className="text-blue-400"> Powered by Roobet</span> • 
              Play responsibly. 18+
            </p>
            <p className="text-slate-600 text-xs">
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
      </footer>
    </div>
  );
}
