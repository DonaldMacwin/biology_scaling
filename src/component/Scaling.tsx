import { useState, useEffect, type ReactElement } from "react";
import "../css/Scaling.css";

const TOTAL_PAGES = 15;
const CENTER = Math.ceil(TOTAL_PAGES / 2);

export default function Scaling(): ReactElement {
    const [sliderPos, setSliderPos] = useState<number>(CENTER);
    const [plusminusHtml, setPlusminusHtml] = useState<string>("");

    useEffect(() => {
        const diff = sliderPos - CENTER;

        const path = (() => {
            if (diff === 0) {
                return "/html/default.html";
            } else if (diff > 0 && diff <= 5) {
                const idx = diff - 1;
                const pad = String(idx).padStart(2, "0");
                return `/html/power+${pad}.html`;
            } else if (diff > 0 && (diff === 6 || diff === 7)) {
                // +6 / +7 は存在しないので非表示
                return null;
            } else if (diff < 0 && Math.abs(diff) <= 7) {
                const pad = String(Math.abs(diff)).padStart(2, "0");
                return `/html/power-${pad}.html`;
            } else {
                return null;
            }
        })();

        if (path) {
            fetch(path)
                .then((r) => r.text())
                .then((txt) => {
                    const fixed = txt.replace(/className=/g, "class=");
                    const m = fixed.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i);
                    const content = m ? m[1] : fixed;
                    setPlusminusHtml(content);
                })
                .catch(() => setPlusminusHtml(""));
        } else {
            setTimeout(() => setPlusminusHtml(""), 0);
        }
    }, [sliderPos]);

    const diffRender = sliderPos - CENTER;

    return (
        <div className="scaling-root">
            <div className="scaling-content">
                {plusminusHtml ? (
                    <section className="scaling-page active">
                        <div
                            className="page-description"
                            dangerouslySetInnerHTML={{ __html: plusminusHtml || "" }}
                        />
                    </section>
                ) : null}
            </div>

            <div className="scaling-slider-wrapper" aria-hidden={false}>
                <div className="vertical-rotator">
                    <input
                        className="vertical-slider"
                        type="range"
                        min={1}
                        max={TOTAL_PAGES}
                        value={sliderPos}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            const proposedDiff = v - CENTER;
                            // +6 / +7 は選択させない（無視）、負側は -7 まで許可
                            if (proposedDiff === 6 || proposedDiff === 7) return;
                            setSliderPos(v);
                        }}
                        aria-label="画面切替スライダー"
                    />
                </div>
                {/* +6 / +7 は乗数カウンター非表示 */}
                {!(diffRender === 6 || diffRender === 7) ? (
                    <div className="slider-counter">
                        10<sup>{diffRender === 0 ? 1 : diffRender}</sup><span className="unit">M</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
