# Sentence Highlighter Library

A production-ready, standalone JavaScript library extracted from the Sentence Focus Notes project. This library provides sentence-by-sentence highlighting functionality that can be easily integrated into any web application.

**Created by:** [AKHIL DESAI](https://www.linkedin.com/in/akhildesai20/)  
**Email:** akhil.desai20@gmail.com  
**LinkedIn:** [@akhildesai20](https://www.linkedin.com/in/akhildesai20/)

## 📦 Package Structure

```
sentence-highlighter/
├── sentence-highlighter.js    # Main library file
├── sentence-highlighter-README.md  # Full documentation
├── example-usage.html          # Live example
└── LIBRARY-README.md          # This file
```

## 🚀 Quick Integration

### Step 1: Include the Library

```html
<script src="sentence-highlighter.js"></script>
```

### Step 2: Initialize

```javascript
const editor = document.getElementById('my-editor');
const highlighter = new SentenceHighlighter(editor);
```

### Step 3: Done!

The library automatically handles sentence detection and highlighting.

## 📋 Features

- ✅ **Zero dependencies** - Pure vanilla JavaScript
- ✅ **Lightweight** - ~8KB minified
- ✅ **Easy integration** - Works with any contenteditable element
- ✅ **Highly configurable** - Extensive options API
- ✅ **Event-driven** - Callbacks for sentence changes
- ✅ **Performance optimized** - Debounced updates
- ✅ **Focus mode** - Dim non-active sentences
- ✅ **Heading support** - Recognizes H1-H3 as sentences

## 🎯 Use Cases

- Distraction-free writing tools
- Focus/meditation writing apps
- Typewriter-style editors
- Writing practice applications
- Note-taking apps with focus features
- Educational writing tools

## 📚 Documentation

See `sentence-highlighter-README.md` for complete API documentation, examples, and customization options.

## 🔧 Configuration Example

```javascript
const highlighter = new SentenceHighlighter(editor, {
  enableFocusMode: true,
  focusModeDimOpacity: 0.18,
  autoScroll: true,
  headingTags: ['h1', 'h2', 'h3'],
  onActiveSentenceChange: (index, sentence) => {
    console.log('Active sentence:', sentence);
  }
});
```

## 📝 Example Usage

See `example-usage.html` for a complete working example with:
- Focus mode toggle
- Stats display
- Manual update button
- Info display

## 🔄 Next Steps for Publishing

1. **Minify the code**
   ```bash
   # Use terser or similar
   terser sentence-highlighter.js -o sentence-highlighter.min.js
   ```

2. **Add to npm**
   ```bash
   npm init
   npm publish
   ```

3. **Create CDN version**
   - Upload to jsDelivr, unpkg, or similar

4. **Add TypeScript definitions** (optional)
   - Create `sentence-highlighter.d.ts`

5. **Add unit tests** (optional)
   - Test sentence detection
   - Test highlighting
   - Test focus mode

6. **Create GitHub repository**
   - Add LICENSE (MIT recommended)
   - Add CONTRIBUTING.md
   - Set up CI/CD

## 👤 Author

**AKHIL DESAI**

- 📧 Email: [akhil.desai20@gmail.com](mailto:akhil.desai20@gmail.com)
- 💼 LinkedIn: [@akhildesai20](https://www.linkedin.com/in/akhildesai20/)

## 📄 License

MIT License - Free to use in any project, commercial or personal.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- More sentence detection rules
- Better performance optimizations
- Framework integrations (React, Vue, etc.)
- TypeScript support
- Unit tests

## 📞 Support

For issues, questions, or contributions, open an issue on the repository.

You can also contact the author directly:
- **Email:** [akhil.desai20@gmail.com](mailto:akhil.desai20@gmail.com)
- **LinkedIn:** [@akhildesai20](https://www.linkedin.com/in/akhildesai20/)

---

**Ready to publish!** This library is self-contained, well-documented, and ready for distribution.

