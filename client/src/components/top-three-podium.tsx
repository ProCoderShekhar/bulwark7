import { Crown, Medal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Player {
  username: string;
  totalWager: number;
  rank: number;
  prize: number;
}

interface TopThreePodiumProps {
  players: Player[];
}

export function TopThreePodium({ players }: TopThreePodiumProps) {
  const first = players[0];
  const second = players[1];
  const third = players[2];

  if (!first && !second && !third) return null;

  const Card = ({ place, player }: { place: 1 | 2 | 3; player: Player }) => {
    const isFirst = place === 1;
    const isSecond = place === 2;
    const isThird = place === 3;

    const colors = isFirst
      ? { border: 'border-yellow-500/30', glow: 'shadow-yellow-500/25', text: 'text-yellow-300' }
      : isSecond
      ? { border: 'border-slate-300/30', glow: 'shadow-slate-300/20', text: 'text-slate-200' }
      : { border: 'border-amber-700/30', glow: 'shadow-amber-600/20', text: 'text-amber-300' };

    const pedestalHeight = isFirst ? 'h-10' : isSecond ? 'h-8' : 'h-7';

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-sm">
          <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-400/10 via-blue-500/10 to-cyan-400/10 blur-2xl ${isFirst ? '' : 'opacity-70'}`} />
          <div className={`relative glass-card rounded-2xl p-6 border-2 ${colors.border} ${colors.glow}`}>
            <div className="absolute -top-4 right-4">
              <div className="rank-badge w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-slate-900 bg-white/80">
                {place}
              </div>
            </div>

            <div className="text-center">
              <div className="relative inline-block mb-3">
                {isFirst ? (
                  <Crown className="w-14 h-14 text-yellow-300 drop-shadow" />
                ) : (
                  <Medal className={`w-12 h-12 ${isSecond ? 'text-slate-300' : 'text-amber-500'}`} />
                )}
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold mb-1 ${colors.text}`}>{player.username}</h3>
              <div className="text-2xl sm:text-3xl font-bold prize-text mb-1">
                {formatCurrency(player.totalWager)}
              </div>
              <p className="text-sm text-slate-400">
                Prize: <span className="text-blue-400 font-semibold">{formatCurrency(player.prize)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className={`mt-3 w-full max-w-sm ${pedestalHeight} rounded-b-2xl bg-gradient-to-t from-slate-800/90 to-slate-800/50 border-x border-b border-slate-700/60`} />
      </div>
    );
  };

  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-slate-50 mb-6 text-center">Top Performers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {second && (
          <div className="md:order-1">
            <Card place={2} player={second} />
          </div>
        )}
        {first && (
          <div className="md:order-2">
            <Card place={1} player={first} />
          </div>
        )}
        {third && (
          <div className="md:order-3">
            <Card place={3} player={third} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TopThreePodium;


