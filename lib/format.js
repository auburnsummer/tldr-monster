const md = require('markdown-it')();
const terminal = require('@auburnsummer/markdown-it-terminal');
const _ = require('lodash');

md.use(terminal);

/**
 * Given a list, format it to a Markdown string of similar words.
 */
const formatSimilar = (words) => {
    const lines = _.map(words, (word) => {
        return ` - \`${word}\` `
    });
    return _.join(lines, "\n");
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