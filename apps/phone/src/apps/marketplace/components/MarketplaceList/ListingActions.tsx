import React from "react";
import { MarketplaceEvents, MarketplaceListing } from "@typings/marketplace";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import fetchNui from "../../../../utils/fetchNui";
import { useSnackbar } from "@os/snackbar/hooks/useSnackbar";
import { ServerPromiseResp } from "@typings/common";
import { useMyPhoneNumber } from "@os/simcard/hooks/useMyPhoneNumber";
import { useCall } from "@os/call/hooks/useCall";
import { Tooltip } from "@ui/components/Tooltip";
import { MessageSquare, Phone, Trash2, Flag, ShieldAlert } from "lucide-react";
import { cn } from "@utils/cn";

export const ListingActions: React.FC<MarketplaceListing> = ({
	...listing
}) => {
	const myNumber = useMyPhoneNumber();
	const [t] = useTranslation();
	const history = useHistory();
	const { initializeCall } = useCall();
	const { addAlert } = useSnackbar();

	const handleDeleteListing = () => {
		fetchNui<ServerPromiseResp>(MarketplaceEvents.DELETE_LISTING, {
			id: listing.id,
		}).then((resp) => {
			if (resp.status !== "ok") {
				return addAlert({
					message: t("MARKETPLACE.FEEDBACK.DELETE_LISTING_FAILED"),
					type: "error",
				});
			}

			addAlert({
				message: t("MARKETPLACE.FEEDBACK.DELETE_LISTING_SUCCESS"),
				type: "success",
			});
		});
	};

	const handleReportListing = () => {
		fetchNui<ServerPromiseResp>(MarketplaceEvents.REPORT_LISTING, {
			id: listing.id,
		}).then((resp) => {
			if (resp.status !== "ok") {
				return addAlert({
					message: t("MARKETPLACE.FEEDBACK.REPORT_LISTING_FAILED"),
					type: "error",
				});
			}

			addAlert({
				message: t("MARKETPLACE.FEEDBACK.REPORT_LISTING_SUCCESS"),
				type: "success",
			});
		});
	};

	const handleCall = () => {
		initializeCall(listing.number);
	};

	const handleMessage = () => {
		history.push(`/messages/new?phoneNumber=${listing.number}`);
	};

	const isMine = listing.number === myNumber;

	return (
		<div className="flex items-center justify-between gap-3 pt-4">
			<div className="flex items-center gap-2">
				{!isMine ? (
					<>
						<Tooltip title={t("GENERIC.MESSAGE")}>
							<button
								onClick={handleMessage}
								className="h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-90 border border-blue-500/20 shadow-sm"
							>
								<MessageSquare size={20} strokeWidth={2.5} />
							</button>
						</Tooltip>
						<Tooltip title={`${t("GENERIC.CALL")}: ${listing.number}`}>
							<button
								onClick={handleCall}
								className="h-12 w-12 flex items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 border border-emerald-500/20 shadow-sm"
							>
								<Phone size={20} strokeWidth={2.5} />
							</button>
						</Tooltip>
					</>
				) : (
					<div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
						<ShieldAlert size={16} />
						<span className="text-[10px] font-black uppercase tracking-widest italic">Seu Anúncio</span>
					</div>
				)}
			</div>

			<div className="flex items-center gap-2">
				{isMine ? (
					<Tooltip title={t("GENERIC.DELETE")}>
						<button
							onClick={handleDeleteListing}
							className="h-12 px-5 flex items-center justify-center gap-2 rounded-2xl bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95"
						>
							<Trash2 size={18} strokeWidth={2.5} />
							<span className="text-[10px] font-black uppercase tracking-widest">Remover</span>
						</button>
					</Tooltip>
				) : (
					<Tooltip title={t("GENERIC.REPORT")}>
						<button
							onClick={handleReportListing}
							className="h-12 w-12 flex items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 border border-neutral-200 dark:border-neutral-700 shadow-sm"
						>
							<Flag size={20} strokeWidth={2.5} />
						</button>
					</Tooltip>
				)}
			</div>
		</div>
	);
};
