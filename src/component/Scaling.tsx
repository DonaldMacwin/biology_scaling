import React, { useState } from "react";
import "../css/Scaling.css";

const TOTAL_PAGES = 15;

export default function Scaling(): JSX.Element {
	const [page, setPage] = useState<number>(1);

	const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

	return (
		<div className="scaling-root">
			<div className="scaling-content">
				{pages.map((n) => (
					<section
						key={n}
						className={`scaling-page ${n === page ? "active" : ""}`}
						aria-hidden={n === page ? "false" : "true"}
					>
						<h1 className="page-title">画面test{String(n).padStart(2, "0")}<br /></h1>
                        <div className="page-description">これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。これは生物のスケーリングに関する情報を表示するための画面です。</div>
					</section>
				))}
			</div>

			<div className="scaling-slider-wrapper" aria-hidden={false}>
				<div className="vertical-rotator">
					<input
						className="vertical-slider"
						type="range"
						min={1}
						max={TOTAL_PAGES}
						/* 表示を上が最小(1)にするために値を反転してマッピング */
						value={TOTAL_PAGES - page + 1}
						onChange={(e) => setPage(TOTAL_PAGES - Number(e.target.value) + 1)}
						aria-label="画面切替スライダー"
					/>
				</div>
				<div className="slider-counter">{String(page).padStart(2, "0")}</div>
			</div>
		</div>
	);
}

