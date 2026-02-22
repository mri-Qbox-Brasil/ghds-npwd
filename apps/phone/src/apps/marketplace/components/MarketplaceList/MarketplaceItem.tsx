import React from "react";
import { PictureResponsive } from "@ui/components/PictureResponsive";
import { MarketplaceListing } from "@typings/marketplace";
import { ListingActions } from "./ListingActions";
import { PictureReveal } from "@ui/components/PictureReveal";
import { useTranslation } from "react-i18next";
import { Package } from 'lucide-react';

interface MarketplaceListingProps extends MarketplaceListing {
	children?: React.ReactNode;
}

export const MarketplaceItem: React.FC<MarketplaceListingProps> = ({
	...listing
}) => {
	const [t] = useTranslation();

	return (
		<div className="px-4 mb-4">
			<div className="bg-white dark:bg-neutral-800/80 rounded-2xl overflow-hidden">
				{/* Image */}
				{listing.url ? (
					<div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
						<PictureReveal>
							<PictureResponsive src={listing.url} alt={`${listing.name}`} className="w-full h-full object-cover" />
						</PictureReveal>
					</div>
				) : (
					<div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center gap-2">
						<Package size={40} strokeWidth={1.5} className="text-neutral-300 dark:text-neutral-600" />
						<p className="text-[12px] text-neutral-400">
							{t("MARKETPLACE.NO_IMAGE")}
						</p>
					</div>
				)}

				{/* Content */}
				<div className="p-4 space-y-3">
					<div>
						<h3 className="text-[17px] font-semibold text-neutral-900 dark:text-white leading-snug">
							{listing.title}
						</h3>
						<p className="text-[13px] text-neutral-500 mt-0.5">
							{listing.name} · Los Santos
						</p>
					</div>

					<p className="text-[14px] text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
						{listing.description}
					</p>

					<ListingActions {...listing} />
				</div>
			</div>
		</div>
	);
};
