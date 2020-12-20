import React, {Component} from 'react';
import PropTypes from 'prop-types'

class Highlighter extends Component {
    static propTypes = {
        caseSensitive: PropTypes.bool,
        searchWords: PropTypes.array,
        textToHighlight: PropTypes.string,
    };
    static defaultProps = {
        caseSensitive: false,
        searchWords: [],
        textToHighlight: ''
    };

    renderHighlighter(textToHighlight, searchWords, caseSensitive) {
        let data = []
        let AllWords = []
        let firstEnd = []
        let firstIndexesWord = []
        let wordLength
        let findWordObj = []
        if(textToHighlight) {
            searchWords.map((word, idx) => {
                if (word && word.text)
                    return (
                        wordLength = word.text.length,
                            caseSensitive ? firstIndexesWord = [...textToHighlight.matchAll(word.text)].map(a => a.index) : firstIndexesWord = [...textToHighlight.matchAll(new RegExp(word.text, 'gi'))].map(a => a.index),
                            findWordObj = firstIndexesWord.map((first, index) => Object.assign({
                                    from: first,
                                    to: first + wordLength - 1,
                                    style: word.style || {},
                                    word: word.text,
                                }),
                            ),
                            AllWords.push(...findWordObj),
                            firstIndexesWord.map((first) => firstEnd.push(first, first + wordLength - 1))
                    )
            })
            if (AllWords.length === 0) return textToHighlight
            firstEnd.push(0, textToHighlight.length - 1)
            firstEnd = Array.from(new Set(firstEnd))
            firstEnd.sort((a, b) => a - b)
            firstEnd.map((el, idx) => {
                    for (let i = 0; i < AllWords.length; i++) {
                        let key = `${idx}_${i}_${Math.random()}`
                        let style = {...AllWords[i].style, padding: '0'}
                        if (idx === 0 && AllWords[i].from !== el) {
                            data.push(<span key={key}>{textToHighlight.slice(el, firstEnd[idx + 1])}</span>)
                            break;
                        } else if (AllWords[i].from === el && AllWords[i].to === firstEnd[idx + 1]) {
                            data.push(<mark key={key}
                                            style={style}>{textToHighlight.slice(el, firstEnd[idx + 1] + 1)}</mark>)
                            break;
                        } else if (AllWords[i].from === el && AllWords[i].to !== firstEnd[idx + 1]) {
                            data.push(<mark key={key}
                                            style={style}>{textToHighlight.slice(el, firstEnd[idx + 1])}</mark>)
                            break;
                        } else if (AllWords[i].from !== el && AllWords[i].to === firstEnd[idx + 1]) {

                            data.push(<mark key={key}
                                            style={style}>{textToHighlight.slice(el + 1, firstEnd[idx + 1] + 1)}</mark>)
                            break;
                        } else if (AllWords[i].to === el && idx !== 0 && idx + 1 !== firstEnd.length - 1) {
                            data.push(<span key={key}>{textToHighlight.slice(el + 1, firstEnd[idx + 1])}</span>)
                            break;
                        } else if (AllWords[i].to === el && idx !== 0 && idx + 1 === firstEnd.length - 1) {
                            data.push(<span key={key}>{textToHighlight.slice(el + 1, firstEnd[idx + 1] + 1)}</span>)
                            break;
                        }
                    }
                }
            )
        }
        return data
    }

    render() {
        const {caseSensitive, searchWords, textToHighlight} = this.props
        return (
            <React.Fragment>
                {this.renderHighlighter(textToHighlight, searchWords, caseSensitive)}
            </React.Fragment>
        );
    }
}

export default Highlighter;