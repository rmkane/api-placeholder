const unindentCode = (codeElement) => {
    const lines = codeElement.textContent.split('\n');
    const [indent] = lines.find(line => line.trim().length).match(/^\s*/);
    const replacer = new RegExp(`^${indent}`);
    codeElement.textContent = lines.map(line =>
        line.replace(replacer, '')).join('\n').trim();

}

addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('code').forEach(unindentCode);
});