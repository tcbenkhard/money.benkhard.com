export const stripPrefix = (originalString: string, separatorChar: string = '#') => {
    return originalString.slice(originalString.indexOf(separatorChar) + 1);
}