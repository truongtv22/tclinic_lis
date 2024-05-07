import { ASCII_CODE, ASCII_TEXT } from '../constants';

export function asciiToText(str: string) {
  return str.replace(/[\x00-\x1F]/g, (match) => {
    return `<${ASCII_TEXT[match.charCodeAt(0) as keyof typeof ASCII_TEXT]}>`;
  });
}

export function textToAscii(str: string) {
  return str.replace(/<([^>]+)>/g, (match, p1) => {
    return String.fromCharCode(ASCII_CODE[p1 as keyof typeof ASCII_CODE]);
  });
}
