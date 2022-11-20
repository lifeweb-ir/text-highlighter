import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderToString } from "react-dom/server";

const htmlToString = (html, changeBr = true, paragrephLength = 0) => {
  const stripHtml = (html = undefined) => {
    let tmp = document.createElement("DIV");
    html = html.replace(/<div.*?>/gim, " ");
    html = html.replace(/<\/div>/gim, " ");
    html = html.replace(/<span.*?>/gim, " ");
    html = html.replace(/<\/span>/gim, " ");
    html = html.replace(/<a.*?>/gim, " ");
    html = html.replace(/<\/a>/gim, " ");
    html = html.replace(/<li.*?>/gim, " ");
    html = html.replace(/<\/li>/gim, " ");
    html = html.replace(/<p.*?>/gim, " ");
    html = html.replace(/<\/p>/gim, " ");
    html = html.replace(/<script.*>.*<\/script>/gim, " ");
    html = html.replace(/<style.*>.*<\/style>/gim, " ");
    html = html.replace(/<svg.*>.*<\/svg>/gim, " ");
    // html = html.replace(/\s\s/gim, " ");
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || "";
    return text !== "[object Object]" ? text : "";
  };
  const chunks = (ar, chunkSize) => {
    const res = [];
    for (let i = 0; i < ar.length; i += chunkSize) {
      const chunk = ar.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };
  let c = null;
  if (changeBr) c = `${renderToString(html)}`.replace(/<br ?\/?>/gi, "\n");
  else c = html;
  let t = stripHtml(c);
  if (paragrephLength) {
    let r = t.split(".") || [];
    let rt = chunks(r, paragrephLength);
    let ft = rt.join(".\n");
    return ft;
  }
  return t;
};

class Highlighter extends Component {
  constructor(props) {
    super(props);
    this.breakCount = 0;
  }

  addBreak = (text = "", start, end, breakIndex = []) => {
    let _t = text.slice(start, end);
    let t = [];
    let s = 0;
    let e = _t.length;
    if (!breakIndex.length) return _t;
    for (let i = 0; i < breakIndex.length; i++) {
      let bIndex = breakIndex[i] - this.breakCount;
      if (bIndex < start) {
        continue;
      }
      if (bIndex > end) {
        t.push(<span key={`b_${i}`}>{_t.slice(s, _t.length)}</span>);
        e = 0;
        break;
      }

      if (bIndex > start) {
        e = bIndex - start + this.breakCount;
        if (s < e) {
          t.push(<span key={`b_${i}`}>{_t.slice(s, e)}</span>);
        }
        t.push(<br key={`bb_${i}`} />);
        this.breakCount++;
        s = bIndex - start + this.breakCount - 1;
      }
    }
    if (t.length === 0 || e) {
      t.push(<span key={`b_end`}>{_t.slice(s, _t.length)}</span>);
    }

    return t;
  };

  renderHighlighter(_textToHighlight, searchWords, caseSensitive) {
    let data = [];
    let AllWords = [];
    let firstEnd = [];
    let firstIndexesWord = [];
    let findWordObj = [];
    if (_textToHighlight) {
      let textToHighlight = "";
      let breakLineIndex = [];
      if (typeof _textToHighlight === "object") {
        if (!_textToHighlight.type) {
          try {
            let _t = JSON.stringify(_textToHighlight);
            textToHighlight = ` ${_t.trim()} `;
          } catch {
            return "textToHighlight";
          }
        } else {
          textToHighlight = ` ${htmlToString(
            _textToHighlight,
            true,
            3
          ).trim()} `;
          breakLineIndex = [
            ...textToHighlight.matchAll(new RegExp(`\n`, "gim")),
          ].map((a) => a.index);
          textToHighlight = textToHighlight.replace(
            new RegExp(`\n`, "gim"),
            " "
          );
        }
      } else {
        textToHighlight = ` ${_textToHighlight.trim()} `;
      }
      searchWords.map((word, idx) => {
        if (word && word.text) {
          let r = new RegExp(
              caseSensitive ? ` ${word.text.trim()} ` : `${word.text.trim()}`,
              "gim"
          )
          firstIndexesWord = [
            ...textToHighlight.matchAll(
              new RegExp(
                caseSensitive ? ` ${word.text.trim()} ` : `${word.text.trim()}`,
                "gim"
              )
            ),
          ].map((a) => [a.index,a[0].length,a[0]]);
          let caseSensitiveWord = caseSensitive ? 0 : 1;
          findWordObj = firstIndexesWord.map((first, index) => {
            firstEnd.push(first[0], first[0] + first[1]);

            return Object.assign({
              from: first[0] - caseSensitiveWord,
              to: first[0] + first[1] - caseSensitiveWord,
              style: word.style || {},
              word: word.text,
              idx: idx,
              onClick:(w,e)=> {
                word.onClick && word.onClick(first[2], w, e)
              },
            });
          });
          AllWords.push(...findWordObj);
        }
      });

      textToHighlight = textToHighlight.trim();

      if (AllWords.length === 0) return textToHighlight;

      firstEnd.push(0, textToHighlight.length);

      firstEnd = Array.from(new Set(firstEnd));
      firstEnd.sort((a, b) => a - b);

      let all = AllWords.sort((a, b) => {
        if (a.from > b.from) return 1;

        if (a.from < b.from) return -1;

        if (a.to > b.to) return 1;

        if (a.to < b.to) return -1;

        return 0;
      });

      let start = 0;
      let end = -1;

      all = [
        ...new Map(
          all.map((item) => [`${item["from"]}_${item["to"]}`, item])
        ).values(),
      ];

      for (let i = 0; i < all.length; i++) {
        let style = all[i].style || {};
        start = all[i].from;

        if (end < start) {
          data.push(
            <span key={`s_${i}`} style={{ padding: "0" }}>
              {this.addBreak(textToHighlight, end, start, breakLineIndex)}
            </span>
          );
        } else {
          continue;
        }

        end = all[i].to;

        // اگر شروع بعدی از انتها کوچکتر بود
        for (let j = i + 1; j < all.length; j++) {
          if (all[j].from <= end && all[j].to >= end) {
            end = all[j].to;
            i = j;
          }
        }
        data.push(
          <mark onClick={(e)=> all[i].onClick(all[i].word, e)} key={`m_${i}`} style={{ padding: "0" , ...style}}>
            {this.addBreak(textToHighlight, start, end, breakLineIndex)}
          </mark>
        );
      }

      if (end < textToHighlight.length) {
        data.push(
          <span key={`m_end`} style={{ padding: "0" }}>
            {this.addBreak(
              textToHighlight,
              end,
              textToHighlight.length,
              breakLineIndex
            )}
          </span>
        );
      }
    }
    return <span style={{ padding: "0" }}>{data}</span>;
  }

  render() {
    const { caseSensitive, searchWords, textToHighlight } = this.props;
    return (
      <React.Fragment>
        {" "}
        {this.renderHighlighter(
          textToHighlight,
          searchWords,
          caseSensitive
        )}{" "}
      </React.Fragment>
    );
  }
}

export default Highlighter;
