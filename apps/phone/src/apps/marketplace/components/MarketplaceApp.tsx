import React, { useRef } from "react";
import { AppWrapper } from "@ui/components";
import { AppContent } from "@ui/components/AppContent";
import { DynamicHeader } from "@ui/components/DynamicHeader";
import { MarketplaceListContainer } from "./MarketplaceList/MarketplaceListContainer";
import { NavigationBar } from "./navigation/NavigationBar";
import { Switch, Route } from "react-router-dom";
import { ListingFormContainer } from "./form/ListingFormContainer";
import { useApp } from "@os/apps/hooks/useApps";
import { WordFilterProvider } from "@os/wordfilter/providers/WordFilterProvider";
import { createExternalAppProvider } from "@os/apps/utils/createExternalAppProvider";

export const MarketplaceApp: React.FC = () => {
	const marketplaceApp = useApp("MARKETPLACE");
	const Provider = createExternalAppProvider(marketplaceApp);
	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<Provider>
			<AppWrapper id="marketplace-app" className="bg-white/40 dark:bg-black/40 backdrop-blur-md">
				<Switch>
					<Route path="/marketplace" exact>
						<DynamicHeader title="Marketplace" scrollRef={scrollRef} variant="pinned" />
						<AppContent
							ref={scrollRef}
							className="flex flex-col grow pb-24 scrollbar-hide h-full relative"
						>
							<DynamicHeader title="Marketplace" scrollRef={scrollRef} variant="largeTitle" />
							<WordFilterProvider>
								<MarketplaceListContainer />
							</WordFilterProvider>
						</AppContent>
						<NavigationBar />
					</Route>

					<Route path="/marketplace/new">
						<WordFilterProvider>
							<ListingFormContainer />
						</WordFilterProvider>
					</Route>
				</Switch>
			</AppWrapper>
		</Provider>
	);
};
