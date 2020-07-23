const md = require('markdown-it')();
const terminal = require('@auburnsummer/markdown-it-terminal');
const _ = require('lodash');

md.use(terminal);

/**
 * Given a list, format it to a Markdown string of similar words.
 */
const formatSimilar = (words) => {
    return _.join(_.map(words, word => `**${word}**`), ", ");
}

/**
 * Format a markdown string for an ANSI terminal
 */

const render = (markdown) => {
    return md.render(markdown);
}

module.exports = {
    render,
    formatSimilar
}