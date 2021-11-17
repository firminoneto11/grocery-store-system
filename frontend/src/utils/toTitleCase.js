
export const toTitleCase = string => {
    // Function that will convert each letter of a given string to uppercase and return the original string, but, title cased!
    string = string.split(' ');
    string = string.map(word => word.toLowerCase());
    string = string.map(word => {
        let first = word.charAt(0).toUpperCase();
        let rest = word.slice(1);
        return first + rest;
    });
    string = string.join(' ');
    return string;
}
