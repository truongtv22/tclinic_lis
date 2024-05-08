import { ASCII_CODE, ASCII_TEXT } from '../constants';

/**
 * Replaces ASCII control characters in a string
 * with their corresponding text representation
 */
export function asciiToText(
  str: string,
  ignore: (string | number)[] = [ASCII_CODE.LF],
) {
  return str.replace(/[\x00-\x1F]/g, (match) => {
    const char = match.charCodeAt(0) as keyof typeof ASCII_TEXT;
    if (ignore.includes(char)) return match;
    if (ASCII_TEXT[char]) return `<${ASCII_TEXT[char]}>`;
    return match;
  });
}

/**
 * Replaces text representations of ASCII control characters
 * in a string with their corresponding ASCII characters
 */
export function textToAscii(str: string) {
  return str.replace(/<([^>]+)>/g, (match, p1: keyof typeof ASCII_CODE) => {
    if (ASCII_CODE[p1]) return String.fromCharCode(ASCII_CODE[p1]);
    return match;
  });
}
