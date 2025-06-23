import { Crown, Trophy, Medal, Star } from 'lucide-react';
import { formatCurrency, getRankSuffix } from '@/lib/utils';

interface Player {
  username: string;
  totalWager: number;
  rank: number;
  prize: number;
}

interface LeaderboardCardProps {
  player: Player;
  isTopThree?: boolean;
}

export function LeaderboardCard({ player, isTopThree = false }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Trophy className="w-8 h-8 text-slate-300" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-400" />;
      default:
        return <span className="text-xl font-mono font-bold text-slate-50">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          border: 'border-yellow-500/30',
          glow: 'shadow-yellow-500/20',
          text: 'text-yellow-500'
        };
      case 2:
        return {
          border: 'border-slate-300/30',
          glow: 'shadow-slate-300/20',
          text: 'text-slate-300'
        };
      case 3:
        return {
          border: 'border-orange-400/30',
          glow: 'shadow-orange-400/20',
          text: 'text-orange-400'
        };
      default:
        return {
          border: 'border-slate-700/50',
          glow: 'shadow-blue-500/10',
          text: 'text-slate-50'
        };
    }
  };

  const rankStyle = getRankStyle(player.rank);

  if (isTopThree) {
    return (
      <div className={`glass-card-hover rounded-2xl p-8 border-2 ${rankStyle.border} ${rankStyle.glow} shadow-2xl`}>
        <div className="text-center">
          <div className="rank-badge w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            {getRankIcon(player.rank)}
          </div>
          <h4 className={`text-2xl font-bold mb-3 ${rankStyle.text}`}>
            {player.username}
          </h4>
          <div className="text-4xl font-bold prize-text mb-3">
            {formatCurrency(player.totalWager)}
          </div>
          <div className="text-sm text-slate-400">
            Prize: <span className="text-blue-400 font-semibold">{formatCurrency(player.prize)}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              {player.rank}{getRankSuffix(player.rank)} Place
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-hover rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="rank-badge w-14 h-14 rounded-full flex items-center justify-center text-lg">
            {getRankIcon(player.rank)}
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-50 mb-1">
              {player.username}
            </h4>
            <p className="text-sm text-slate-400">
              {player.rank}{getRankSuffix(player.rank)} Place
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-50 mb-1">
            {formatCurrency(player.totalWager)}
          </div>
          <div className="text-sm text-slate-400">
            Prize: <span className="text-blue-400 font-semibold">{formatCurrency(player.prize)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
