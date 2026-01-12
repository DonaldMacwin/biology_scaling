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

    useEffect(() => {
        const diff = sliderPos - CENTER;

        const POS_PATH_MAP: Record<number, string> = {
            1: "/html/power+01.html",
            2: "/html/power+02.html",
            3: "/html/power+03.html",
            4: "/html/power+04.html",
            5: "/html/power+05.html",
        };

        const NEG_PATH_MAP: Record<number, string> = {};
        NEG_PATH_MAP[-1] = "/html/power-01.html";
        NEG_PATH_MAP[-2] = "/html/power-02.html";
        NEG_PATH_MAP[-3] = "/html/power-03.html";
        NEG_PATH_MAP[-4] = "/html/power-04.html";
        NEG_PATH_MAP[-5] = "/html/power-05.html";

        const mappingPath =
            diff === 0 ? "/html/default.html" : diff > 0 ? POS_PATH_MAP[diff] : NEG_PATH_MAP[diff];

        if (mappingPath) {
            fetch(mappingPath)
                .then((r) => r.text())
                .then((txt) => {
                    const fixed = txt.replace(/className=/g, "class=");
                    const m = fixed.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i);
                    const content = m ? m[1] : fixed;
                    setPlusminusHtml(content);
                })
                .catch(() => setPlusminusHtml(""));
        } else {
            // 同期的な setState によるカスケードレンダーを避けるため非同期で更新する
            setTimeout(() => setPlusminusHtml(""), 0);
        }
    }, [sliderPos]);

    const diffRender = sliderPos - CENTER;
    // <sup>タグ表示用は文字列マッピング
    const POS_MAP_DISPLAY: Record<number, string> = {
        1: "1〜3",
        2: "7",
        3: "11",
        4: "21",
        5: "36",
    };
    const NEG_MAP_DISPLAY: Record<string, string> = {
        "-1": "-1",
        "-2": "-5",
        "-3": "-9",
        "-4": "-16",
        "-5": "-29",
    };
    const mappedDisplay: string =
        diffRender === 0
            ? "1"
            : diffRender > 0
            ? POS_MAP_DISPLAY[diffRender] ?? String(diffRender)
            : NEG_MAP_DISPLAY[String(diffRender)] ?? String(diffRender);
    const displayLabel: string = customExp !== null ? customExp : mappedDisplay;

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
        </div>
    );
}
