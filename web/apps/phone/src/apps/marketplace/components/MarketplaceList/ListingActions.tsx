import React from "react";
import { MarketplaceEvents, MarketplaceListing } from "@typings/marketplace";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import fetchNui from "../../../../utils/fetchNui";
import { useSnackbar } from "@os/snackbar/hooks/useSnackbar";
import { ServerPromiseResp } from "@typings/common";
import { useMyPhoneNumber } from "@os/simcard/hooks/useMyPhoneNumber";
import { useCall } from "@os/call/hooks/useCall";
import { MessageSquare, Phone, Trash2, Flag } from "lucide-react";

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
		<div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-700/50">
			{!isMine ? (
				<div className="flex items-center gap-2">
					<button
						onClick={handleMessage}
						className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 active:bg-blue-100 transition-colors text-[13px] font-medium"
					>
						<MessageSquare size={16} />
						Mensagem
					</button>
					<button
						onClick={handleCall}
						className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 active:bg-emerald-100 transition-colors text-[13px] font-medium"
					>
						<Phone size={16} />
						Ligar
					</button>
				</div>
			) : (
				<span className="text-[13px] text-neutral-400 font-medium">Seu anúncio</span>
			)}

			<div>
				{isMine ? (
					<button
						onClick={handleDeleteListing}
						className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-500 active:bg-red-50 dark:active:bg-red-500/10 transition-colors text-[13px] font-medium"
					>
						<Trash2 size={16} />
						Remover
					</button>
				) : (
					<button
						onClick={handleReportListing}
						className="p-2 rounded-xl text-neutral-400 active:text-red-500 active:bg-neutral-100 dark:active:bg-neutral-800 transition-colors"
					>
						<Flag size={16} />
					</button>
				)}
			</div>
		</div>
	);
};
