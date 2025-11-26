# Sentence Highlighter

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Size](https://img.shields.io/badge/size-11KB%20minified-lightgrey.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)

A lightweight, zero-dependency JavaScript library for highlighting sentences one at a time as you type. Perfect for distraction-free writing tools, focus apps, and typewriter-style editors.

**Created by:** [AKHIL DESAI](https://www.linkedin.com/in/akhildesai20/)  
**Email:** akhil.desai20@gmail.com  
**LinkedIn:** [@akhildesai20](https://www.linkedin.com/in/akhildesai20/)

## Features

- 🎯 **Sentence-by-sentence highlighting** - Automatically highlights the sentence containing your cursor
- 🎨 **Focus mode** - Dims non-active sentences for better focus
- 📝 **Heading support** - Recognizes headings (H1-H3) as complete sentences
- ⚡ **Lightweight** - No dependencies, ~8KB minified
- 🔧 **Highly configurable** - Customizable classes, behavior, and callbacks
- 📱 **Works everywhere** - Works with any `contenteditable` element
- 🚀 **Performance optimized** - Uses virtual sentence model, CSS-based highlighting, and incremental updates

## 🚀 Quick Start

**Try it live:** [View Demo](https://akhildesai20.github.io/sentence-highlighter/example-usage.html)

## Installation

### Option 1: Download and Include

Download `sentence-highlighter.js` and include it in your HTML:

```html
<script src="sentence-highlighter.js"></script>
```

### Option 2: CDN (via GitHub)

```html
<script src="https://cdn.jsdelivr.net/gh/akhildesai20/sentence-highlighter@main/sentence-highlighter.min.js"></script>
```

### Option 3: npm (coming soon)

```bash
npm install sentence-highlighter
```

```javascript
import SentenceHighlighter from 'sentence-highlighter';
```

## Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    #editor {
      width: 100%;
      min-height: 300px;
      padding: 20px;
      border: 1px solid #ddd;
      font-size: 18px;
      line-height: 1.7;
    }
  </style>
</head>
<body>
  <div id="editor" contenteditable="true">
    Start typing here. Each sentence will be highlighted as you write.
  </div>

  <script src="sentence-highlighter.js"></script>
  <script>
    const editor = document.getElementById('editor');
    const highlighter = new SentenceHighlighter(editor);
  </script>
</body>
</html>
```

That's it! The library will automatically:
- Detect sentences as you type
- Highlight the sentence containing your cursor
- Dim other sentences (focus mode)

## API Reference

### Constructor

```javascript
const highlighter = new SentenceHighlighter(editorElement, options);
```

**Parameters:**
- `editorElement` (HTMLElement, required) - The contenteditable element to attach to
- `options` (Object, optional) - Configuration options

### Options

```javascript
{
  // CSS Classes
  sentenceClass: 'sentence',                    // Class for all sentences
  activeSentenceClass: 'sentence--active',      // Class for active sentence
  containerClass: 'paragraph',                  // Class for container div
  
  // Data Attributes (for CSS targeting)
  sentenceDataAttribute: 'data-sentence-id',    // Data attribute on sentence spans
  activeSentenceDataAttribute: 'data-sentence-active', // Data attribute on active sentence

  // Behavior
  enableFocusMode: true,                        // Enable focus mode (dim non-active)
  focusModeDimOpacity: 0.18,                   // Opacity for dimmed sentences
  autoScroll: true,                             // Auto-scroll to keep caret centered
  scrollBehavior: 'smooth',                     // 'smooth' or 'auto'

  // Sentence Detection
  headingTags: ['h1', 'h2', 'h3'],             // Tags treated as complete sentences (currently not used)
  sentenceEndings: ['.', '!', '?'],            // Characters that end sentences

  // Performance
  updateDebounce: 100,                          // Debounce time in ms for input events
  updateThrottle: 50,                           // Throttle time in ms for navigation events

  // Callbacks
  onSentenceChange: (sentences) => {},         // Called when sentences change
  onActiveSentenceChange: (index, sentence) => {} // Called when active sentence changes
}
```

### Methods

#### `update()`
Manually trigger an update of sentence highlighting.

```javascript
highlighter.update();
```

#### `setFocusMode(enabled)`
Enable or disable focus mode.

```javascript
highlighter.setFocusMode(true);  // Enable
highlighter.setFocusMode(false); // Disable
```

#### `toggleFocusMode()`
Toggle focus mode on/off.

```javascript
highlighter.toggleFocusMode();
```

#### `getSentences()`
Get array of all detected sentences.

```javascript
const sentences = highlighter.getSentences();
// Returns: [{ text: "...", start: 0, end: 15, isHeading: false }, ...]
```

#### `getActiveSentence()`
Get the currently active sentence object.

```javascript
const active = highlighter.getActiveSentence();
// Returns: { text: "...", start: 0, end: 15, isHeading: false } or null
```

#### `getActiveSentenceIndex()`
Get the index of the currently active sentence.

```javascript
const index = highlighter.getActiveSentenceIndex();
// Returns: 0, 1, 2, ... or -1
```

#### `destroy()`
Destroy the instance and clean up event listeners.

```javascript
highlighter.destroy();
```

## Examples

### Custom Styling

```html
<style>
  #editor {
    max-width: 800px;
    margin: 0 auto;
    font-size: 18px;
    line-height: 1.8;
  }

  .sentence {
    opacity: 0.2;
    transition: opacity 0.3s ease;
  }

  .sentence--active {
    opacity: 1;
    background: rgba(255, 255, 0, 0.1);
  }
</style>

<script>
  const highlighter = new SentenceHighlighter(
    document.getElementById('editor'),
    {
      focusModeDimOpacity: 0.2
    }
  );
</script>
```

### With Toggle Button

```html
<button id="toggle-focus">Toggle Focus Mode</button>
<div id="editor" contenteditable="true"></div>

<script>
  const editor = document.getElementById('editor');
  const toggleBtn = document.getElementById('toggle-focus');
  
  const highlighter = new SentenceHighlighter(editor);
  
  toggleBtn.addEventListener('click', () => {
    highlighter.toggleFocusMode();
  });
</script>
```

### With Callbacks

```javascript
const highlighter = new SentenceHighlighter(editor, {
  onSentenceChange: (sentences) => {
    console.log(`Total sentences: ${sentences.length}`);
  },
  
  onActiveSentenceChange: (index, sentence) => {
    if (sentence) {
      console.log(`Active: "${sentence.text}"`);
      console.log(`Position: ${index + 1} of ${highlighter.getSentences().length}`);
    }
  }
});
```

### Custom Sentence Detection

```javascript
const highlighter = new SentenceHighlighter(editor, {
  // Include H4-H6 as headings
  headingTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  
  // Custom sentence endings (include semicolons)
  sentenceEndings: ['.', '!', '?', ';'],
  
  // Faster updates
  updateDebounce: 50
});
```

### Multiple Instances

```javascript
// Each editor can have its own highlighter instance
const editor1 = new SentenceHighlighter(document.getElementById('editor1'));
const editor2 = new SentenceHighlighter(document.getElementById('editor2'), {
  enableFocusMode: false
});
```

## Customization

### CSS Classes

The library adds these classes and data attributes that you can style:

- `.sentence` - All sentence elements
- `.sentence--active` - Currently active sentence
- `.paragraph` - Container div for sentences (configurable via `containerClass`)
- `.sentence-highlighter-heading` - Sentence that is a heading (if heading detection is enabled)
- `.sentence-highlighter-focus-off` - Added to editor when focus mode is disabled
- `[data-sentence-id]` - Data attribute on all sentence spans (configurable via `sentenceDataAttribute`)
- `[data-sentence-active]` - Data attribute on active sentence (configurable via `activeSentenceDataAttribute`)

### Example CSS

```css
/* Default dimmed sentences */
.sentence {
  opacity: 0.18;
  transition: opacity 0.2s ease;
}

/* Active sentence */
.sentence--active {
  opacity: 1;
  font-weight: 500;
}

/* When focus mode is off, all sentences visible */
.sentence-highlighter-focus-off .sentence {
  opacity: 1;
}

/* Heading sentences */
.sentence.sentence-highlighter-heading {
  font-weight: 600;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

Requires ES6+ support (modern browsers).

## License

MIT License - feel free to use in any project.

## Author

**AKHIL DESAI**

- 📧 Email: [akhil.desai20@gmail.com](mailto:akhil.desai20@gmail.com)
- 💼 LinkedIn: [@akhildesai20](https://www.linkedin.com/in/akhildesai20/)

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

For questions or suggestions, you can reach out directly:
- **Email:** [akhil.desai20@gmail.com](mailto:akhil.desai20@gmail.com)
- **LinkedIn:** [@akhildesai20](https://www.linkedin.com/in/akhildesai20/)

## Architecture

This library uses a **hybrid approach** for optimal performance:

1. **Virtual Sentence Model** - Sentences are maintained as a data structure (Map), separate from DOM rendering
2. **Span-based Highlighting** - Wraps sentences in `<span>` elements with classes and data attributes for CSS styling
3. **Incremental Updates** - Only rebuilds highlights when content actually changes, not on every keystroke
4. **Event-driven** - Debounced/throttled updates for optimal performance

This approach ensures:
- ✅ Better performance (minimal DOM manipulation, smart rebuild detection)
- ✅ Smooth, flicker-free updates
- ✅ Easy CSS customization via classes and data attributes
- ✅ Preserves text content (wraps in spans but doesn't modify formatting)

## Changelog

### v2.0.0
- **Major refactor** to hybrid approach:
  - Virtual sentence model (data structure)
  - Span-based highlighting with classes and data attributes
  - Incremental updates (only rebuilds when content changes)
  - Event-driven with debouncing/throttling
- Better performance and stability
- Proper initialization and defensive checks

### v1.0.0
- Initial release
- Sentence detection and highlighting
- Focus mode support
- Heading recognition
- Auto-scroll to caret

## Roadmap

- [ ] Support for multiple paragraphs
- [ ] Custom sentence detection rules via regex
- [ ] Animation effects for sentence transitions
- [ ] Virtual scrolling for long documents
- [ ] TypeScript definitions
- [ ] React/Vue wrapper components

