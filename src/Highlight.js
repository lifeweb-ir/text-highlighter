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
  static propTypes = {
    caseSensitive: PropTypes.bool,
    searchWords: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        style: PropTypes.object,
      })
    ),
    textToHighlight: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  };
  static defaultProps = {
    caseSensitive: false,
    searchWords: [],
    textToHighlight: "",
  };
  constructor(props) {
    super(props);
    this.breakCount = 0;
  }

  addBreak = (text = "", start, end, breakIndex = []) => {
    let _t = text.slice(start, end);
    let t = [];
    let s = 0;
    let e = _t.length;
    if(!breakIndex.length) return _t;
    for (let i = 0; i < breakIndex.length; i++) {
      let bIndex= breakIndex[i] - this.breakCount
      if (bIndex < start) {
        continue;
      }
      if (bIndex > end) {
        t.push(<span key={`b_${i}`}>{_t.slice(s, _t.length)}</span>);
        e = 0;
        break;
      }

      if (bIndex > start) {
        e =  bIndex - start - 1;
        if(s<e){
          t.push(<span key={`b_${i}`}>{_t.slice(s, e)}</span>);
        }
        t.push(<br key={`bb_${i}`} />);
        this.breakCount++;
        s = bIndex - start - 1;
      }
    }
    if (t.length === 0 || e) {
        console.log('+++', e ,_t.slice(s, _t.length));
      t.push(<span key={`b_end`}>{_t.slice(s, _t.length)}</span>);
    }

    return t;
  };

  renderHighlighter(_textToHighlight, searchWords, caseSensitive) {
    let data = [];
    let AllWords = [];
    let firstEnd = [];
    let firstIndexesWord = [];
    let wordLength;
    let findWordObj = [];
    if (_textToHighlight) {
      let textToHighlight = ` ${htmlToString(
        _textToHighlight,
        true,
        3
      ).trim()} `;

      let breakLineIndex = [
        ...textToHighlight.matchAll(new RegExp(`\n`, "gim")),
      ].map((a) => a.index);
      textToHighlight = textToHighlight.replace(new RegExp(`\n`, "gim"), "");
      searchWords.map((word, idx) => {
        if (word && word.text) {
          wordLength = word.text.trim().length;

          firstIndexesWord = [
            ...textToHighlight.matchAll(
              new RegExp(caseSensitive ? ` ${word.text.trim()} ` : `${word.text.trim()}` , "gim")
            ),
          ].map((a) => a.index);
          let caseSensitiveWord = caseSensitive ? 0 : 1
          findWordObj = firstIndexesWord.map((first, index) => {
            firstEnd.push(first, first + wordLength);

            return Object.assign({
              from: first - caseSensitiveWord,
              to: first + wordLength - caseSensitiveWord,
              style: word.style || {},
              word: word.text,
              idx: idx,
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
      let end = 0;

      console.log(all, caseSensitive);

      for (let i = 0; i < all.length; i++) {
        let style = all[i].style;
        start = all[i].from;

        if (end < start) {
          data.push(
            <span key={`s_${i}`} style={{ padding: "0" }}>
              {this.addBreak(textToHighlight, end, start, breakLineIndex)}
            </span>
          );
        }

        end = all[i].to;

        // اگر شروع بعدی از انتها کوچکتر بود
        for (let j = i + 1; j < all.length; j++) {
          if (all[j].from < end && all[j].to > end) {
            end = all[j].to;
            i = j;
          }
        }
        data.push(
          <mark key={`m_${i}`} style={style}>
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
    return data;
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
