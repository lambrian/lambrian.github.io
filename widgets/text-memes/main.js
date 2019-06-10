const memes = {
  'spongebob': (text) => {
    return text.replace(
      /(\w)(\w)?/g,
      (match, p1, p2, p3) => {
        return p1.toLowerCase() + (p2 || '').toUpperCase();
      }
    );
  },
  'clapping': (text) => {
    const clappingText = text.replace(
      /(\w+)/g,
      (m, p1) => (p1 + "").toUpperCase(),
    );
    return clappingText.replace(/\s+/g, '<span>&#x1F44F</span>');
  },
  'alien': (text) => {
    return text.replace(/(.)/g, '$1 ');
  },
  'azn': (text) => {
    return text
      .replace(/boy/g, 'boi')
      .replace(/s(\s|$)/g, 'z$1');
  },
};

const memeSectionRefs = {};

const textArea = document.getElementById('main-text');

for (meme in memes) {
  const memeSection = document.createElement('div');
  memeSection.setAttribute('id', meme);
  memeSection.setAttribute('class', 'meme-section');
  memeSectionRefs[meme] = memeSection;
  document.body.appendChild(memeSection);
}

const processText = (text) => {
  for (meme in memes) {
    const section = memeSectionRefs[meme];
    if (section) {
      section.innerHTML = memes[meme](text);
    }
  }
};

textArea.onkeyup = () => processText(textArea.value);
processText(textArea.placeholder);
