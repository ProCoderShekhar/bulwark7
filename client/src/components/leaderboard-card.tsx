import { Crown, Trophy, Medal } from 'lucide-react';
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
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-lg font-orbitron font-bold text-gaming-off-white">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-500/50 text-yellow-500';
      case 2:
        return 'border-gray-400/50 text-gray-300';
      case 3:
        return 'border-orange-600/50 text-orange-400';
      default:
        return 'border-gaming-accent/50 text-gaming-off-white';
    }
  };

  if (isTopThree) {
    return (
      <div className={`gaming-card gaming-glow-hover rounded-2xl p-6 border-2 ${getRankColor(player.rank)}`}>
        <div className="text-center">
          <div className="rank-badge w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-orbitron font-black">
            {getRankIcon(player.rank)}
          </div>
          <h4 className={`text-xl font-rajdhani font-bold mb-2 ${getRankColor(player.rank).split(' ')[1]}`}>
            {player.username}
          </h4>
          <div className="text-3xl font-orbitron font-black text-gaming-accent mb-2">
            {formatCurrency(player.totalWager)}
          </div>
          <div className="text-sm text-gaming-metallic">
            Prize: <span className="text-gaming-accent font-semibold">{formatCurrency(player.prize)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gaming-card gaming-glow-hover rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="rank-badge w-12 h-12 rounded-full flex items-center justify-center text-lg font-orbitron font-bold">
            {getRankIcon(player.rank)}
          </div>
          <div>
            <h4 className="text-xl font-rajdhani font-bold text-gaming-off-white">
              {player.username}
            </h4>
            <p className="text-sm text-gaming-metallic">
              {player.rank}{getRankSuffix(player.rank)} Place
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-orbitron font-bold text-gaming-accent">
            {formatCurrency(player.totalWager)}
          </div>
          <div className="text-sm text-gaming-metallic">
            Prize: <span className="text-gaming-accent">{formatCurrency(player.prize)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
