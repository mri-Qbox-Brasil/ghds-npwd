import { Link } from 'react-router-dom';
import { AppIcon } from '@ui/components';

interface DockProps {
    apps: any[];
}

export const Dock: React.FC<DockProps> = ({ apps }) => {
    if (!apps || apps.length === 0) return null;

    return (
        <div style={{ position: 'absolute', bottom: '8px', left: '4%', right: '4%' }}>
            <div className="h-24 w-full rounded-[28px] backdrop-blur-[5px] backdrop-saturate-[180%] bg-white/15 border border-white/20 flex items-center justify-evenly px-[10px]">
                {apps.map((app) => (
                    <Link key={app.id} to={app.path} style={{ textDecoration: 'none' }}>
                        <AppIcon {...app} isDockItem={true} />
                    </Link>
                ))}
            </div>
        </div>
    );
};
