/**
 * Sentence Highlighter - A lightweight JavaScript library for sentence-by-sentence highlighting
 * 
 * Uses a hybrid approach:
 * - Virtual Sentence Model (data structure)
 * - Span-based Highlighting (wraps sentences in spans with classes/data attributes)
 * - Incremental Updates (only rebuilds when content changes)
 * - Event-driven (debounced/throttled updates)
 * 
 * @version 2.0.0
 * @license MIT
 * @author AKHIL DESAI <akhil.desai20@gmail.com>
 * @see {@link https://www.linkedin.com/in/akhildesai20/|LinkedIn Profile}
 * 
 * This library is designed to be AI-friendly with comprehensive JSDoc type annotations,
 * clear examples, and well-documented APIs for use with AI code assistants.
 * 
 * @example
 * // Basic usage
 * const editor = document.getElementById('editor');
 * const highlighter = new SentenceHighlighter(editor);
 * 
 * @example
 * // With options
 * const highlighter = new SentenceHighlighter(editor, {
 *   enableFocusMode: true,
 *   focusModeDimOpacity: 0.18,
 *   onActiveSentenceChange: (index, sentence) => {
 *     console.log('Active sentence:', sentence);
 *   }
 * });
 */

(function(window) {
  'use strict';

  /**
   * @typedef {Object} SentenceHighlighterOptions
   * @property {string} [sentenceClass='sentence'] - CSS class for all sentence elements
   * @property {string} [activeSentenceClass='sentence--active'] - CSS class for active sentence
   * @property {string} [containerClass='paragraph'] - CSS class for container div
   * @property {string} [sentenceDataAttribute='data-sentence-id'] - Data attribute on sentence spans
   * @property {string} [activeSentenceDataAttribute='data-sentence-active'] - Data attribute on active sentence
   * @property {boolean} [enableFocusMode=true] - Enable focus mode (dim non-active sentences)
   * @property {number} [focusModeDimOpacity=0.18] - Opacity for dimmed sentences (0-1)
   * @property {boolean} [autoScroll=true] - Auto-scroll to keep caret centered
   * @property {string} [scrollBehavior='smooth'] - Scroll behavior: 'smooth' or 'auto'
   * @property {string[]} [headingTags=['h1', 'h2', 'h3']] - HTML tags treated as complete sentences
   * @property {string[]} [sentenceEndings=['.', '!', '?']] - Characters that end sentences
   * @property {number} [updateDebounce=100] - Debounce time in ms for input events
   * @property {number} [updateThrottle=50] - Throttle time in ms for navigation events
   * @property {Function|null} [onSentenceChange] - Callback when sentences change: (sentences: Sentence[]) => void
   * @property {Function|null} [onActiveSentenceChange] - Callback when active sentence changes: (index: number, sentence: Sentence|null) => void
   */

  /**
   * @typedef {Object} Sentence
   * @property {string} id - Unique identifier for the sentence
   * @property {string} text - The sentence text content
   * @property {number} start - Character offset start position
   * @property {number} end - Character offset end position
   * @property {boolean} isHeading - Whether this sentence is a heading
   */

  /**
   * SentenceHighlighter - Main class for sentence-by-sentence highlighting
   * 
   * Automatically detects sentences in a contenteditable element and highlights
   * the sentence containing the caret, dimming all other sentences.
   * 
   * @class
   * @example
   * const editor = document.getElementById('editor');
   * const highlighter = new SentenceHighlighter(editor, {
   *   enableFocusMode: true,
   *   onActiveSentenceChange: (index, sentence) => {
   *     console.log(`Sentence ${index + 1}: ${sentence.text}`);
   *   }
   * });
   */
  class SentenceHighlighter {
    /**
     * Create a new SentenceHighlighter instance
     * @param {HTMLElement} editorElement - The contenteditable element to attach to
     * @param {SentenceHighlighterOptions} [options={}] - Configuration options
     * @throws {Error} If editorElement is not valid or not contenteditable
     */
    constructor(editorElement, options = {}) {
      // Validate editor element
      if (!editorElement || !editorElement.nodeType) {
        throw new Error('SentenceHighlighter: Valid editor element is required');
      }

      if (!editorElement.isContentEditable) {
        throw new Error('SentenceHighlighter: Element must be contenteditable');
      }

      this.editor = editorElement;
      this.options = {
        // CSS class names
        sentenceDataAttribute: options.sentenceDataAttribute || 'data-sentence-id',
        activeSentenceDataAttribute: options.activeSentenceDataAttribute || 'data-sentence-active',
        containerClass: options.containerClass || 'paragraph',
        sentenceClass: options.sentenceClass || 'sentence',
        activeSentenceClass: options.activeSentenceClass || 'sentence--active',
        
        // Behavior options
        enableFocusMode: options.enableFocusMode !== false, // default true
        focusModeDimOpacity: options.focusModeDimOpacity || 0.18,
        autoScroll: options.autoScroll !== false, // default true
        scrollBehavior: options.scrollBehavior || 'smooth',
        
        // Sentence detection
        headingTags: options.headingTags || ['h1', 'h2', 'h3'],
        sentenceEndings: options.sentenceEndings || ['.', '!', '?'],
        
        // Performance
        updateDebounce: options.updateDebounce || 100,
        updateThrottle: options.updateThrottle || 50,
        
        // Callbacks
        onSentenceChange: options.onSentenceChange || null,
        onActiveSentenceChange: options.onActiveSentenceChange || null,
        
        ...options
      };

      // Virtual Sentence Model (data structure - not tied to DOM)
      this.sentenceMap = new Map(); // Maps sentence IDs to sentence metadata
      this.sentenceElements = new Map(); // Maps sentence IDs to DOM elements
      this.activeSentenceId = null;
      
      // State
      this.isInitialized = false;
      this.updateTimer = null;
      this.lastContentHash = null;
      this.focusModeEnabled = this.options.enableFocusMode;

      // Bind methods
      this.handleInput = this.handleInput.bind(this);
      this.handleNavigation = this.handleNavigation.bind(this);
      this.handleCaretMove = this.handleCaretMove.bind(this);
      
      // Initialize
      this.init();
    }

    /**
     * Initialize the highlighter
     * @private
     * @returns {void}
     */
    init() {
      if (this.isInitialized) return;

      // Inject required CSS if not already present
      this.injectCSS();

      // Mark editor with identifier
      this.editor.classList.add(this.options.containerClass);
      if (!this.focusModeEnabled) {
        this.editor.classList.add('sentence-highlighter-focus-off');
      }

      // Set up event listeners
      this.attachEvents();

      // Initial scan and highlight (with small delay to ensure DOM is ready)
      setTimeout(() => {
        this.scanAndHighlight();
      }, 10);

      this.isInitialized = true;
    }

    /**
     * Inject required CSS styles into the document head
     * @private
     * @returns {void}
     */
    injectCSS() {
      const styleId = 'sentence-highlighter-styles';
      if (document.getElementById(styleId)) return;

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .${this.options.containerClass} .${this.options.sentenceClass} {
          opacity: ${this.options.focusModeDimOpacity};
          transition: opacity 0.18s ease, color 0.18s ease;
        }
        
        .${this.options.containerClass} .${this.options.sentenceClass}.${this.options.activeSentenceClass},
        .${this.options.containerClass} .${this.options.sentenceClass}[${this.options.activeSentenceDataAttribute}] {
          opacity: 1 !important;
        }
        
        .sentence-highlighter-focus-off .${this.options.containerClass} .${this.options.sentenceClass} {
          opacity: 1;
        }
      `;
      
      document.head.appendChild(style);
    }

    /**
     * Attach event listeners for input, navigation, and selection changes
     * @private
     * @returns {void}
     */
    attachEvents() {
      // Input events (typing, pasting, etc.)
      this.editor.addEventListener('input', this.handleInput);
      
      // Immediate update for sentence-ending characters
      this.editor.addEventListener('keydown', (e) => {
        // Check if the key is a sentence ending character
        if (this.options.sentenceEndings.includes(e.key)) {
          // Clear any pending debounced update
          clearTimeout(this.updateTimer);
          // Schedule immediate update after input event processes the character
          // Use a slightly longer delay to ensure the character is in the DOM
          this.updateTimer = setTimeout(() => {
            this.scanAndHighlight();
          }, 20);
        }
      });
      
      
      // Navigation events
      this.editor.addEventListener('click', this.handleNavigation);
      this.editor.addEventListener('keyup', (e) => {
        const navigationKeys = [
          'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
          'Home', 'End', 'PageUp', 'PageDown'
        ];
        if (navigationKeys.includes(e.key)) {
          this.handleNavigation();
        }
      });

      // Selection changes (caret moves)
      document.addEventListener('selectionchange', this.handleCaretMove);

      // Focus/blur
      this.editor.addEventListener('focus', () => this.handleNavigation());
    }

    /**
     * Handle input events with debouncing
     * @private
     * @returns {void}
     */
    handleInput() {
      const text = this.getPlainText();
      const caretOffset = this.getCaretOffset();
      
      // Check if we just typed after a sentence ending character
      // This ensures immediate update when starting a new sentence
      let shouldUpdateImmediately = false;
      if (caretOffset > 1) {
        const charBefore = text[caretOffset - 2]; // -2 because caret is after the just-typed char
        if (this.options.sentenceEndings.includes(charBefore)) {
          shouldUpdateImmediately = true;
        }
      }
      
      clearTimeout(this.updateTimer);
      // Use shorter delay if typing after sentence ending, otherwise use normal debounce
      const delay = shouldUpdateImmediately ? 10 : this.options.updateDebounce;
      this.updateTimer = setTimeout(() => {
        this.scanAndHighlight();
      }, delay);
    }

    /**
     * Handle navigation events (arrow keys, clicks, etc.) with throttling
     * @private
     * @returns {void}
     */
    handleNavigation() {
      // Throttle for better performance
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.updateActiveSentence();
      }, this.options.updateThrottle);
    }

    /**
     * Handle caret move events (selection changes) with throttling
     * @private
     * @returns {void}
     */
    handleCaretMove() {
      if (!this.editor.contains(window.getSelection()?.anchorNode)) {
        return;
      }
      
      // Throttle updates
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.updateActiveSentence();
      }, this.options.updateThrottle);
    }

    /**
     * Generate stable sentence ID based on position and content
     */
    generateSentenceId(start, end, text, isHeading) {
      // Create hash from position and text content
      const hash = this.simpleHash(`${start}-${end}-${text.substring(0, 20)}-${isHeading}`);
      return `sentence-${hash}`;
    }

    /**
     * Simple hash function for stable IDs
     */
    simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36);
    }

    /**
     * Get caret character offset within editor
     * @private
     * @returns {number} Character offset from the start of the editor content
     */
    getCaretOffset() {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return 0;

      const range = selection.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(this.editor);
      preRange.setEnd(range.endContainer, range.endOffset);

      return preRange.toString().length;
    }

    /**
     * Set caret position by character offset
     * @private
     * @param {number} targetOffset - Character offset from the start of the editor content
     * @returns {void}
     */
    setCaretOffset(targetOffset) {
      const selection = window.getSelection();
      const range = document.createRange();
      let currentOffset = 0;
      let found = false;

      const traverse = (node) => {
        if (found) return;

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          const nextOffset = currentOffset + text.length;

          if (targetOffset <= nextOffset) {
            const localOffset = targetOffset - currentOffset;
            range.setStart(node, Math.max(0, localOffset));
            range.collapse(true);
            found = true;
            return;
          }

          currentOffset = nextOffset;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          for (let i = 0; i < node.childNodes.length; i++) {
            traverse(node.childNodes[i]);
            if (found) return;
          }
        }
      };

      traverse(this.editor);

      if (!found) {
        range.selectNodeContents(this.editor);
        range.collapse(false);
      }

      selection.removeAllRanges();
      selection.addRange(range);
    }

    /**
     * Build virtual sentence model from editor content
     * @private
     * @returns {Sentence[]} Array of sentence objects with id, text, start, end, isHeading
     */
    buildSentenceMap() {
      const text = this.getPlainText();
      if (!text.trim()) {
        return [];
      }
      
      const sentences = [];
      
      // Simple regex-based sentence detection
      const pattern = `[^${this.options.sentenceEndings.map(e => '\\' + e).join('')}]+[${this.options.sentenceEndings.map(e => '\\' + e).join('')}]?\\s*`;
      const regex = new RegExp(pattern, 'g');
      let match;
      let lastIndex = 0;
      
      while ((match = regex.exec(text)) !== null) {
        const chunk = match[0];
        const start = match.index;
        const end = start + chunk.length;
        const id = this.generateSentenceId(start, end, chunk, false);
        
        sentences.push({
          id: id,
          text: chunk,
          start: start,
          end: end,
          isHeading: false
        });
        
        lastIndex = regex.lastIndex;
      }
      
      // Handle any remaining text that doesn't end with sentence punctuation
      if (lastIndex < text.length) {
        const remaining = text.substring(lastIndex);
        if (remaining.trim().length > 0) {
          const id = this.generateSentenceId(lastIndex, text.length, remaining, false);
          sentences.push({
            id: id,
            text: remaining,
            start: lastIndex,
            end: text.length,
            isHeading: false
          });
        }
      }
      
      // If no sentences found, treat entire text as one sentence
      if (sentences.length === 0 && text.trim().length > 0) {
        const id = this.generateSentenceId(0, text.length, text, false);
        sentences.push({
          id: id,
          text: text,
          start: 0,
          end: text.length,
          isHeading: false
        });
      }
      
      return sentences;
    }


    /**
     * Get plain text from editor (removes all HTML)
     */
    getPlainText() {
      // Get text content, which strips all HTML tags
      return this.editor.textContent || this.editor.innerText || '';
    }

    /**
     * Get content hash for change detection
     */
    getContentHash() {
      return this.getPlainText().length + '-' + this.editor.innerHTML.length;
    }

    /**
     * Find which sentence contains the caret
     * @deprecated This method is kept for backward compatibility but findActiveSentenceIndex is preferred
     */
    findActiveSentenceId(caretOffset) {
      const sentences = Array.from(this.sentenceMap.values());
      const activeIndex = this.findActiveSentenceIndex(sentences, caretOffset);
      if (activeIndex >= 0 && activeIndex < sentences.length) {
        return sentences[activeIndex].id;
      }
      return null;
    }

    /**
     * Scan content and highlight sentences (incremental update)
     */
    scanAndHighlight() {
      // Get text and caret BEFORE any DOM manipulation
      const text = this.getPlainText();
      const isEmpty = !text.trim();
      
      if (isEmpty) {
        // Clear all highlights
        this.clearAllHighlights();
        this.sentenceMap.clear();
        this.sentenceElements.clear();
        this.activeSentenceId = null;
        this.lastContentHash = '';
        return;
      }

      const contentHash = this.getContentHash();
      const caretOffset = this.getCaretOffset();
      
      // Build sentence map from current text
      const newSentences = this.buildSentenceMap();
      
      if (newSentences.length === 0) {
        return;
      }
      
      const activeIndex = this.findActiveSentenceIndex(newSentences, caretOffset);
      
      // Check if we need to rebuild (always rebuild if content changed or no highlights exist)
      const needsRebuild = contentHash !== this.lastContentHash || 
                          !this.sentenceElements || 
                          this.sentenceElements.size === 0 ||
                          !this.hasValidHighlights();
      
      if (needsRebuild) {
        // Rebuild highlighting
        this.rebuildHighlights(newSentences, activeIndex, caretOffset);
        this.lastContentHash = contentHash;
      } else {
        // Just update active sentence (incremental update)
        this.updateActiveSentenceFromMap(newSentences, activeIndex);
      }
      
      // Store sentences in virtual model
      this.sentenceMap.clear();
      newSentences.forEach(s => {
        this.sentenceMap.set(s.id, s);
      });
      
      // Callback
      if (this.options.onSentenceChange) {
        this.options.onSentenceChange(Array.from(this.sentenceMap.values()));
      }
      
      // Auto-scroll if enabled
      if (this.options.autoScroll) {
        this.scrollCaretToCenter();
      }
    }
    
    /**
     * Find active sentence index from sentence array
     */
    findActiveSentenceIndex(sentences, caretOffset) {
      for (let i = 0; i < sentences.length; i++) {
        const s = sentences[i];
        // Check if caret is within sentence bounds (excluding the end boundary)
        if (caretOffset >= s.start && caretOffset < s.end) {
          return i;
        }
        // If caret is exactly at the end boundary of a sentence, prefer the next sentence
        // This handles the case when typing after a period - the new sentence should be active
        if (caretOffset === s.end && i < sentences.length - 1) {
          return i + 1;
        }
      }
      // If caret is at or beyond the end of the last sentence, return last sentence
      if (sentences.length > 0) {
        const lastSentence = sentences[sentences.length - 1];
        if (caretOffset >= lastSentence.start) {
          return sentences.length - 1;
        }
      }
      return -1;
    }
    
    /**
     * Check if current highlights are valid
     */
    hasValidHighlights() {
      if (!this.sentenceElements) {
        return false;
      }
      return this.sentenceElements.size > 0 && 
             this.editor.querySelectorAll(`[${this.options.sentenceDataAttribute}]`).length > 0;
    }
    
    /**
     * Clear all sentence highlights
     */
    clearAllHighlights() {
      if (!this.sentenceElements) {
        this.sentenceElements = new Map();
      }
      
      // Remove all sentence spans
      const spans = this.editor.querySelectorAll(`[${this.options.sentenceDataAttribute}]`);
      spans.forEach(span => {
        const parent = span.parentNode;
        if (parent && parent !== this.editor) {
          // Unwrap: move children to parent, then remove span
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
          }
          parent.removeChild(span);
        }
      });
      
      // Remove container if it exists and is empty or only has text
      const container = this.editor.querySelector(`.${this.options.containerClass}`);
      if (container) {
        // If container is empty or only has text nodes, remove it
        const hasElements = Array.from(container.childNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE
        );
        if (!hasElements) {
          while (container.firstChild) {
            this.editor.insertBefore(container.firstChild, container);
          }
          this.editor.removeChild(container);
        }
      }
      
      this.sentenceElements.clear();
    }
    
    /**
     * Rebuild highlights by wrapping sentences in spans
     */
    rebuildHighlights(sentences, activeIndex, caretOffset) {
      if (sentences.length === 0) {
        this.clearAllHighlights();
        return;
      }
      
      // Ensure sentenceElements is initialized
      if (!this.sentenceElements) {
        this.sentenceElements = new Map();
      }
      
      // Clear existing sentence element mappings
      this.sentenceElements.clear();
      
      // Create container
      const container = document.createElement('div');
      container.className = this.options.containerClass;
      
      // Wrap each sentence in a span
      sentences.forEach((sentence, i) => {
        const span = document.createElement('span');
        span.setAttribute(this.options.sentenceDataAttribute, sentence.id);
        span.className = this.options.sentenceClass;
        
        if (i === activeIndex && activeIndex >= 0) {
          span.classList.add(this.options.activeSentenceClass);
          span.setAttribute(this.options.activeSentenceDataAttribute, 'true');
          this.activeSentenceId = sentence.id;
        }
        
        if (sentence.isHeading) {
          span.classList.add('sentence-highlighter-heading');
        }
        
        // Use the sentence text directly
        span.textContent = sentence.text;
        container.appendChild(span);
        
        // Store mapping
        this.sentenceElements.set(sentence.id, span);
      });
      
      // Save current selection before replacing content
      const savedCaretOffset = caretOffset;
      
      // Replace editor content
      this.editor.innerHTML = '';
      this.editor.appendChild(container);
      
      // Restore caret position after DOM update
      requestAnimationFrame(() => {
        this.setCaretOffset(savedCaretOffset);
      });
    }
    
    /**
     * Update active sentence from existing map
     */
    updateActiveSentenceFromMap(sentences, activeIndex) {
      if (!this.sentenceElements || activeIndex < 0 || activeIndex >= sentences.length) return;
      
      const newActiveId = sentences[activeIndex].id;
      
      // Remove active from old
      if (this.activeSentenceId) {
        const oldElement = this.sentenceElements.get(this.activeSentenceId);
        if (oldElement) {
          oldElement.classList.remove(this.options.activeSentenceClass);
          oldElement.removeAttribute(this.options.activeSentenceDataAttribute);
        }
      }
      
      // Add active to new
      this.activeSentenceId = newActiveId;
      const newElement = this.sentenceElements.get(newActiveId);
      if (newElement) {
        newElement.classList.add(this.options.activeSentenceClass);
        newElement.setAttribute(this.options.activeSentenceDataAttribute, 'true');
      }
      
      // Callback
      if (this.options.onActiveSentenceChange) {
        const sentence = this.sentenceMap.get(newActiveId);
        this.options.onActiveSentenceChange(activeIndex, sentence || null);
      }
    }

    /**
     * Update active sentence highlighting
     */
    updateActiveSentence() {
      if (!this.sentenceElements || this.sentenceMap.size === 0) return;
      
      const caretOffset = this.getCaretOffset();
      const sentences = Array.from(this.sentenceMap.values());
      const activeIndex = this.findActiveSentenceIndex(sentences, caretOffset);
      
      if (activeIndex < 0) return;
      
      const newActiveId = sentences[activeIndex].id;
      
      // Check if active sentence changed
      if (newActiveId === this.activeSentenceId) {
        return; // No change
      }
      
      // Remove active from old sentence
      if (this.activeSentenceId) {
        const oldElement = this.sentenceElements.get(this.activeSentenceId);
        if (oldElement) {
          oldElement.classList.remove(this.options.activeSentenceClass);
          oldElement.removeAttribute(this.options.activeSentenceDataAttribute);
        }
      }
      
      // Add active to new sentence
      this.activeSentenceId = newActiveId;
      const newElement = this.sentenceElements.get(newActiveId);
      if (newElement) {
        newElement.classList.add(this.options.activeSentenceClass);
        newElement.setAttribute(this.options.activeSentenceDataAttribute, 'true');
      }
      
      // Callback
      if (this.options.onActiveSentenceChange) {
        const sentence = this.sentenceMap.get(newActiveId);
        this.options.onActiveSentenceChange(activeIndex, sentence || null);
      }
      
      // Auto-scroll if enabled
      if (this.options.autoScroll) {
        this.scrollCaretToCenter();
      }
    }

    /**
     * Scroll caret to vertical center
     */
    scrollCaretToCenter() {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (!this.editor.contains(range.startContainer)) return;

      const caretRange = range.cloneRange();
      caretRange.collapse(true);

      const marker = document.createElement('span');
      marker.style.display = 'inline-block';
      marker.style.width = '0';
      marker.style.height = '1em';
      marker.style.visibility = 'hidden';
      marker.setAttribute('data-sentence-highlighter-marker', 'true');

      try {
        caretRange.insertNode(marker);
        marker.scrollIntoView({
          block: 'center',
          inline: 'nearest',
          behavior: this.options.scrollBehavior
        });

        const newRange = document.createRange();
        newRange.setStart(marker, 0);
        newRange.collapse(true);
        
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(newRange);

        const parent = marker.parentNode;
        if (parent && marker.parentNode) {
          parent.removeChild(marker);
        }
      } catch (e) {
        // Silently fail if scroll fails
      }
    }

    /**
     * Enable or disable focus mode
     * @public
     * @param {boolean} enabled - true to enable focus mode (dim non-active sentences), false to disable
     * @returns {void}
     * @example
     * highlighter.setFocusMode(true);  // Enable focus mode
     * highlighter.setFocusMode(false); // Disable focus mode
     */
    setFocusMode(enabled) {
      this.focusModeEnabled = enabled;
      if (enabled) {
        this.editor.classList.remove('sentence-highlighter-focus-off');
      } else {
        this.editor.classList.add('sentence-highlighter-focus-off');
      }
    }

    /**
     * Toggle focus mode on/off
     * @public
     * @returns {boolean} The new focus mode state (true = enabled, false = disabled)
     * @example
     * highlighter.toggleFocusMode(); // Toggle between enabled/disabled
     */
    toggleFocusMode() {
      this.setFocusMode(!this.focusModeEnabled);
    }

    /**
     * Get array of all detected sentences
     * @public
     * @returns {Sentence[]} Array of sentence objects with id, text, start, end, isHeading properties
     * @example
     * const sentences = highlighter.getSentences();
     * console.log(`Total sentences: ${sentences.length}`);
     * sentences.forEach((s, i) => {
     *   console.log(`Sentence ${i + 1}: "${s.text}"`);
     * });
     */
    getSentences() {
      return Array.from(this.sentenceMap.values()).map(s => ({
        id: s.id,
        text: s.text,
        start: s.start,
        end: s.end,
        isHeading: s.isHeading
      }));
    }

    /**
     * Get the currently active sentence (the one containing the caret)
     * @public
     * @returns {Sentence|null} The active sentence object, or null if no sentence is active
     * @example
     * const active = highlighter.getActiveSentence();
     * if (active) {
     *   console.log(`Active: "${active.text}"`);
     * }
     */
    getActiveSentence() {
      if (!this.activeSentenceId) return null;
      const sentence = this.sentenceMap.get(this.activeSentenceId);
      return sentence ? {
        id: sentence.id,
        text: sentence.text,
        start: sentence.start,
        end: sentence.end,
        isHeading: sentence.isHeading
      } : null;
    }

    /**
     * Get the index of the currently active sentence
     * @public
     * @returns {number} Zero-based index of the active sentence, or -1 if no sentence is active
     * @example
     * const index = highlighter.getActiveSentenceIndex();
     * const total = highlighter.getSentences().length;
     * console.log(`Active: sentence ${index + 1} of ${total}`);
     */
    getActiveSentenceIndex() {
      if (!this.activeSentenceId) return -1;
      const ids = Array.from(this.sentenceMap.keys());
      return ids.indexOf(this.activeSentenceId);
    }

    /**
     * Manually trigger a sentence detection and highlighting update
     * Useful when content is modified programmatically
     * @public
     * @returns {void}
     * @example
     * // After programmatically changing editor content
     * editor.textContent = "New content. With multiple sentences!";
     * highlighter.update(); // Re-detect and highlight sentences
     */
    update() {
      this.scanAndHighlight();
    }

    /**
     * Destroy the highlighter instance and clean up all event listeners and DOM modifications
     * @public
     * @returns {void}
     * @example
     * // Clean up when removing the editor from the DOM
     * highlighter.destroy();
     * editor.remove();
     */
    destroy() {
      clearTimeout(this.updateTimer);
      
      // Remove event listeners
      this.editor.removeEventListener('input', this.handleInput);
      this.editor.removeEventListener('click', this.handleNavigation);
      document.removeEventListener('selectionchange', this.handleCaretMove);
      
      // Remove all highlighting
      for (const id of this.sentenceMap.keys()) {
        this.removeSentenceHighlight(id);
      }
      
      // Clear state
      this.sentenceMap.clear();
      this.sentenceElements.clear();
      this.activeSentenceId = null;
      
      // Remove classes
      this.editor.classList.remove(
        this.options.containerClass,
        'sentence-highlighter-focus-off'
      );

      this.isInitialized = false;
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SentenceHighlighter;
  } else {
    window.SentenceHighlighter = SentenceHighlighter;
  }

})(window || global);

/*
 * Sentence Highlighter Library
 * 
 * Author: AKHIL DESAI
 * Email: akhil.desai20@gmail.com
 * LinkedIn: https://www.linkedin.com/in/akhildesai20/
 * 
 * Copyright (c) 2024 AKHIL DESAI
 * Licensed under the MIT License
 */
