import { useState, useEffect, type ReactElement } from "react";
import "../css/Scaling.css";

const TOTAL_PAGES = 11;
const CENTER = Math.ceil(TOTAL_PAGES / 2);

export default function Scaling(): ReactElement {
    const [sliderPos, setSliderPos] = useState<number>(CENTER);
    const [plusminusHtml, setPlusminusHtml] = useState<string>("");
    const [customExp, setCustomExp] = useState<string | null>(null);
    const [editingExp, setEditingExp] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>("");

    // スライダー位置に応じた HTML コンテンツを読み込む
    useEffect(() => {
        const diff = sliderPos - CENTER;

        const POS_PATH_MAP: Record<number, string> = {
            1: "html/power+01.html",
            2: "html/power+02.html",
            3: "html/power+03.html",
            4: "html/power+04.html",
            5: "html/power+05.html",
        };

        const NEG_PATH_MAP: Record<number, string> = {};
        NEG_PATH_MAP[-1] = "html/power-01.html";
        NEG_PATH_MAP[-2] = "html/power-02.html";
        NEG_PATH_MAP[-3] = "html/power-03.html";
        NEG_PATH_MAP[-4] = "html/power-04.html";
        NEG_PATH_MAP[-5] = "html/power-05.html";

        const mappingPath =
            diff === 0 ? "html/default.html" : diff > 0 ? POS_PATH_MAP[diff] : NEG_PATH_MAP[diff];

        if (mappingPath) {
            // Resolve mappingPath relative to this module when possible so built
            // bundles using `base` produce correct asset URLs. Fallback to
            // document.baseURI when import.meta.url is not available.
            let resolved: string;
            if (typeof import.meta !== 'undefined' && typeof (import.meta as any).url === 'string') {
                resolved = new URL(mappingPath, (import.meta as any).url).toString();
            } else {
                const base = (typeof document !== 'undefined' && document.baseURI) ? document.baseURI : window.location.href;
                resolved = new URL(mappingPath, base).toString();
            }
            fetch(resolved)
                .then((r) => r.text())
                .then((txt) => {
                    let fixed = txt.replace(/className=/g, "class=");
                    // Rewrite relative src/href in the fetched fragment to absolute URLs
                    // using the resolved URL as base so images/scripts/styles resolve
                    // to the /biology_scaling/dist/ location when injected into the page.
                    try {
                        const baseForResources = resolved.substring(0, resolved.lastIndexOf('/') + 1);
                        fixed = fixed.replace(/(src|href)=(\")(?!(?:https?:|\/))([^\"]+)(\")/g, (_m, attr, _q1, rel, _q2) => {
                            try {
                                return `${attr}="${new URL(rel, baseForResources).toString()}"`;
                            } catch (e) {
                                return _m;
                            }
                        });
                    } catch (e) {
                        // ignore rewriting on any failure
                    }
                    const m = fixed.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i);
                    const content = m ? m[1] : fixed;
                    setPlusminusHtml(content);
                })
                .catch(() => setPlusminusHtml(""));
        } else {
            // 同期的な setState によるカスケードレンダーを避けるため非同期で更新
            setTimeout(() => setPlusminusHtml(""), 0);
        }
    }, [sliderPos]);

    // スライダー位置から表示用指数を決定する
    const diffRender = sliderPos - CENTER;
    const POS_MAP_DISPLAY: Record<number, string> = {
        1: "2",
        2: "3",
        3: "6",
        4: "8",
        5: "20",
    };
    const NEG_MAP_DISPLAY: Record<string, string> = {
        "-1": "0",
        "-2": "-3",
        "-3": "-5",
        "-4": "-6",
        "-5": "-10",
    };
    const mappedDisplay: string =
        diffRender === 0
            ? "1"
            : diffRender > 0
            ? POS_MAP_DISPLAY[diffRender] ?? String(diffRender)
            : NEG_MAP_DISPLAY[String(diffRender)] ?? String(diffRender);
    const displayLabel: string = customExp !== null ? customExp : mappedDisplay;

    // ページトップへスクロールするハンドラ
    const scrollToTop = (): void => {
        if (typeof document !== "undefined") {
            const active = document.querySelector<HTMLElement>(".scaling-page.active");
            if (active && typeof active.scrollTo === "function") {
                active.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            const content = document.querySelector<HTMLElement>(".scaling-content");
            if (content && typeof content.scrollTo === "function") {
                content.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        }
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

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
                            if (proposedDiff > 5 || proposedDiff < -5) return;
                            setSliderPos(v);
                        }}
                        aria-label="画面切替スライダー"
                    />
                </div>
                {Math.abs(diffRender) <= 5 ? (
                    <div className="slider-counter">
                        10
                        {editingExp ? (
                            <input
                                className="exp-edit"
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => {
                                    const v = editValue.trim();
                                    if (v === "") {
                                        setCustomExp(null);
                                    } else {
                                        setCustomExp(v);
                                    }
                                    setEditingExp(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const v = editValue.trim();
                                        if (v === "") {
                                            setCustomExp(null);
                                        } else {
                                            setCustomExp(v);
                                        }
                                        setEditingExp(false);
                                    } else if (e.key === "Escape") {
                                        setEditingExp(false);
                                    }
                                }}
                                style={{ width: "3.2rem", fontSize: "1.25rem", marginLeft: "4px" }}
                                autoFocus
                            />
                        ) : (
                            <sup
                                onClick={() => {
                                    setEditValue(displayLabel);
                                    setEditingExp(true);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {displayLabel}
                            </sup>
                        )}
                        <span className="unit">M</span>
                    </div>
                ) : null}
            </div>

            <button
                type="button"
                className="back-to-top"
                onClick={scrollToTop}
                aria-label="ページTOPへ"
                title="ページTOPへ"
            >
                ▲
            </button>
        </div>
    );
}
