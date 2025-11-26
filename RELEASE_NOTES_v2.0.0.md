# Release v2.0.0 - Sentence Highlighter

**Release Date:** November 26, 2024

## 🎉 Major Release

This is a major refactor of the Sentence Highlighter library with significant performance improvements and a more robust architecture.

## ✨ What's New

### Major Refactor
- **Virtual Sentence Model**: Sentences are now maintained as a data structure (Map), separate from DOM rendering
- **Span-based Highlighting**: Wraps sentences in `<span>` elements with classes and data attributes for CSS styling
- **Incremental Updates**: Only rebuilds highlights when content actually changes, not on every keystroke
- **Event-driven**: Debounced/throttled updates for optimal performance

### Performance Improvements
- Better performance with minimal DOM manipulation
- Smart rebuild detection to avoid unnecessary updates
- Smooth, flicker-free updates
- More efficient caret position handling

### Developer Experience
- **TypeScript Support**: Full TypeScript definitions included (`.d.ts` file)
- Better initialization with defensive checks
- Improved code documentation with comprehensive JSDoc
- Better separation of concerns

## 🔧 Technical Changes

### Architecture
- Refactored internal architecture for maintainability
- Better separation of concerns
- Improved code documentation

### Bug Fixes
- Proper handling of empty content
- Better caret position preservation during updates
- Improved sentence detection edge cases

## 📦 Installation

```bash
npm install sentence-highlighter
```

Or use via CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/akhildesai20/sentence-highlighter@v2.0.0/sentence-highlighter.min.js"></script>
```

## 🚀 Quick Start

```javascript
const editor = document.getElementById('editor');
const highlighter = new SentenceHighlighter(editor, {
  enableFocusMode: true,
  onActiveSentenceChange: (index, sentence) => {
    console.log(`Active sentence: ${sentence.text}`);
  }
});
```

## 📚 Documentation

- **Full Documentation**: [README.md](https://github.com/akhildesai20/sentence-highlighter/blob/main/README.md)
- **Live Demo**: [Try it now](https://akhildesai20.github.io/sentence-highlighter/example-usage.html)
- **TypeScript Definitions**: Included in the package

## 🔗 Links

- **GitHub**: https://github.com/akhildesai20/sentence-highlighter
- **npm**: Coming soon
- **Issues**: https://github.com/akhildesai20/sentence-highlighter/issues

## 🙏 Thank You

Thank you for using Sentence Highlighter! If you find this library useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing

---

**Author**: [AKHIL DESAI](https://www.linkedin.com/in/akhildesai20/)  
**Email**: akhil.desai20@gmail.com  
**License**: MIT

