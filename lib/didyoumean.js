const _ = require('lodash');
const lev = require('js-levenshtein');

const pick = 7;

/**
 * Given the name list and a string, gets similar ones (did you mean?)
 * 
 * Current algorithm:
 *  - find words that start with the same letter (unlikely to typo first letter)
 *  - sort by levenshtein distance after
 *        
 */
const similarWords = (nameList, s) => {
    const names = _.map(nameList, _.property('name'));
    const filteredNames = _.uniq(_.filter(names, name => name[0] === s[0]));

    const editDistance = _.curry(lev)(s);
    return _.slice(_.sortBy(filteredNames, editDistance), 0, pick);
}

module.exports = {
    similarWords
}