# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-11-26

### Changed
- **Major refactor** to hybrid approach for better performance:
  - Virtual sentence model (data structure) - sentences maintained separately from DOM
  - Span-based highlighting with classes and data attributes for CSS styling
  - Incremental updates - only rebuilds highlights when content actually changes
  - Event-driven with debouncing/throttling for optimal performance
- Improved initialization with defensive checks
- Better performance and stability
- More efficient DOM manipulation

### Fixed
- Proper handling of empty content
- Better caret position preservation during updates
- Improved sentence detection edge cases

### Technical
- Refactored internal architecture for maintainability
- Better separation of concerns
- Improved code documentation with JSDoc

## [1.0.0] - Initial Release

### Added
- Sentence-by-sentence highlighting in contenteditable elements
- Focus mode - dims non-active sentences for better focus
- Heading recognition (H1-H3 treated as complete sentences)
- Auto-scroll to keep caret centered
- Configurable options API
- Event callbacks for sentence changes
- Public API methods:
  - `update()` - Manual update trigger
  - `setFocusMode()` - Enable/disable focus mode
  - `toggleFocusMode()` - Toggle focus mode
  - `getSentences()` - Get all sentences
  - `getActiveSentence()` - Get active sentence
  - `getActiveSentenceIndex()` - Get active sentence index
  - `destroy()` - Clean up instance

### Features
- Zero dependencies - pure vanilla JavaScript
- Lightweight - ~8KB minified
- Works with any contenteditable element
- Highly configurable via options
- Performance optimized with debouncing/throttling

---

## Version History

- **v2.0.0** - Major refactor with hybrid approach
- **v1.0.0** - Initial release

---

For detailed information about each version, see the [releases page](https://github.com/akhildesai20/sentence-highlighter/releases).

