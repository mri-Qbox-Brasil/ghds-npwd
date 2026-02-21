import { Link } from 'react-router-dom';
import { AppIcon } from '@ui/components';

interface DockProps {
    apps: any[];
}

export const Dock: React.FC<DockProps> = ({ apps }) => {
    if (!apps || apps.length === 0) return null;

    return (
        <div style={{ position: 'absolute', bottom: '24px', left: '16px', right: '16px' }}>
            <div className="h-[88px] w-full rounded-[32px] backdrop-blur-sm backdrop-saturate-[200%] bg-white/30 dark:bg-black/30 border border-white/10 dark:border-white/5 flex items-center justify-evenly px-2">
                {apps.map((app) => (
                    <Link key={app.id} to={app.path} style={{ textDecoration: 'none' }}>
                        <AppIcon {...app} isDockItem={true} />
                    </Link>
                ))}
            </div>
        </div>
    );
};
