import React from "react";
import { PictureResponsive } from "@ui/components/PictureResponsive";
import { MarketplaceListing } from "@typings/marketplace";
import { ListingActions } from "./ListingActions";
import { PictureReveal } from "@ui/components/PictureReveal";
import { useTranslation } from "react-i18next";
import { Tag, User, MapPin, Package } from 'lucide-react';

interface MarketplaceListingProps extends MarketplaceListing {
	children?: React.ReactNode;
}

export const MarketplaceItem: React.FC<MarketplaceListingProps> = ({
	...listing
}) => {
	const [t] = useTranslation();

	return (
		<div className="mx-6 mb-8 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<div className="bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 dark:shadow-black/20 flex flex-col group">
				{/* Header - User Info */}
				<header className="p-5 flex items-center justify-between border-b border-neutral-50 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
							<User size={20} strokeWidth={2.5} />
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-black text-neutral-900 dark:text-white truncate max-w-[150px] leading-tight tracking-tight">
								{listing.name}
							</span>
							<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Vendedor Verificado</span>
						</div>
					</div>
					<div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
						<span className="text-[10px] font-black uppercase tracking-widest leading-none">Disponível</span>
					</div>
				</header>

				{/* Image Container */}
				<div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
					{listing.url ? (
						<PictureReveal>
							<PictureResponsive src={listing.url} alt={`${listing.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
						</PictureReveal>
					) : (
						<div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20 text-neutral-400">
							<Package size={48} />
							<p className="text-[10px] font-black uppercase tracking-widest">
								{t("MARKETPLACE.NO_IMAGE")}
							</p>
						</div>
					)}

					{/* Price Tag Overlay */}
					<div className="absolute bottom-4 left-4">
						<div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2">
							<Tag size={14} className="text-blue-400" strokeWidth={3} />
							<span className="text-lg font-black italic text-white tracking-tighter tabular-nums">Oferta Aberta</span>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<div className="space-y-1">
						<h3 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight leading-snug">
							{listing.title}
						</h3>
						<div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">
							<MapPin size={10} />
							<span>Los Santos, SA</span>
						</div>
					</div>

					<p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
						{listing.description}
					</p>

					<div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
						<ListingActions {...listing} />
					</div>
				</div>
			</div>
		</div>
	);
};
