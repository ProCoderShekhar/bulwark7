import { FaXTwitter } from 'react-icons/fa6';
import { FaDiscord, FaVideo } from 'react-icons/fa';

interface SocialLinksProps {
  xUrl?: string;
  discordUrl?: string;
  kickUrl?: string;
}

export function SocialLinks({
  xUrl = 'https://x.com/Bulwark77',
  discordUrl = 'https://discord.com/invite/PSJ4HnJdH6',
  kickUrl = 'https://kick.com/bulwark7',
}: SocialLinksProps) {
  const linkBase = "inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 text-slate-200 hover:text-white transition-colors";
  const iconClass = "w-4 h-4";

  return (
    <div className="flex items-center justify-center sm:justify-start gap-3">
      <a href={xUrl} target="_blank" rel="noopener noreferrer" className={linkBase} aria-label="X (Twitter)">
        <FaXTwitter className={iconClass} />
        <span className="text-sm hidden md:inline">X</span>
      </a>
      <a href={discordUrl} target="_blank" rel="noopener noreferrer" className={linkBase} aria-label="Discord">
        <FaDiscord className={iconClass} />
        <span className="text-sm hidden md:inline">Discord</span>
      </a>
      <a href={kickUrl} target="_blank" rel="noopener noreferrer" className={linkBase} aria-label="Kick">
        <FaVideo className={iconClass} />
        <span className="text-sm hidden md:inline">Kick</span>
      </a>
    </div>
  );
}


