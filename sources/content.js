(function initTraceIdButtonInjector() {
  const ROW_SELECTOR =
    '.druids_misc_json-viewer_row-layout.druids_misc_json-viewer_row-layout--interactive';
  const KEY_CELL_SELECTOR =
    '.druids_misc_json-viewer_row-layout__key.druids_misc_json-viewer_row-layout__key--with-content';
  const VALUE_CELL_SELECTOR = '.druids_misc_json-viewer_row-layout__value';
  const BUTTON_ATTR = 'data-ddchromeext-traceid-button';
  const DASHBOARD_BUTTON_ATTR = 'data-ddchromeext-traceid-table-button';
  const TOOLTIP_ATTR = 'data-ddchromeext-tooltip';
  const TOOLTIP_TEXT = 'Open TraceId logs';
  const FA_STYLESHEET_ATTR = 'data-ddchromeext-fontawesome';
  const FA_STYLESHEET_URL =
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
  const LOGS_URL_TEMPLATE =
    'https://pluxee.datadoghq.eu/logs?query=%40TraceId%3A%22{TraceId}%22&agg_m=count&agg_m_source=base&agg_t=count&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=time%2Cdesc&viz=stream';
  const IFRAME_BUTTON_ATTR = 'data-ddchromeext-traceid-iframe-button';
  const DASHBOARD_IFRAME_BUTTON_ATTR = 'data-ddchromeext-traceid-table-iframe-button';
  const IFRAME_WINDOW_ATTR = 'data-ddchromeext-iframe-window';
  const IFRAME_WINDOW_TRACE_ATTR = 'data-ddchromeext-traceid';
  const IFRAME_TOOLTIP_TEXT = 'Open TraceId logs in panel';
  const IFRAME_WINDOW_BASE_TOP = 60;
  const IFRAME_WINDOW_BASE_LEFT = 60;
  const IFRAME_WINDOW_CASCADE_OFFSET = 24;
  const IFRAME_WINDOW_CASCADE_STEPS = 10;
  let iframeWindowZIndexCounter = 2147483646;

  function ensureFontAwesomeLoaded() {
    if (document.head.querySelector(`[${FA_STYLESHEET_ATTR}]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FA_STYLESHEET_URL;
    link.setAttribute(FA_STYLESHEET_ATTR, 'true');
    document.head.appendChild(link);
  }

  function ensureTooltipStylesLoaded() {
    if (document.head.querySelector('style[data-ddchromeext-tooltip-style]')) {
      return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-ddchromeext-tooltip-style', 'true');
    style.textContent =
      `[${TOOLTIP_ATTR}] {` +
      'position: fixed;' +
      'z-index: 2147483647;' +
      'padding: 4px 8px;' +
      'border-radius: 4px;' +
      'background: #1f2937;' +
      'color: #f9fafb;' +
      'font-size: 12px;' +
      'line-height: 1.2;' +
      'white-space: nowrap;' +
      'pointer-events: none;' +
      'opacity: 0;' +
      'transform: translateY(2px);' +
      'transition: opacity 120ms ease, transform 120ms ease;' +
      '}' +
      `[${TOOLTIP_ATTR}][data-visible="true"] {` +
      'opacity: 1;' +
      'transform: translateY(0);' +
      '}';

    document.head.appendChild(style);
  }

  function getOrCreateTooltipElement() {
    let tooltip = document.body.querySelector(`[${TOOLTIP_ATTR}]`);

    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.setAttribute(TOOLTIP_ATTR, 'true');
      tooltip.setAttribute('data-visible', 'false');
      tooltip.textContent = TOOLTIP_TEXT;
      document.body.appendChild(tooltip);
    }

    return tooltip;
  }

  function showButtonTooltip(button) {
    const tooltip = getOrCreateTooltipElement();
    const rect = button.getBoundingClientRect();

    tooltip.textContent = button.getAttribute('aria-label') || TOOLTIP_TEXT;
    tooltip.style.left = `${Math.max(8, rect.left + rect.width / 2)}px`;
    tooltip.style.top = `${Math.max(8, rect.top - 30)}px`;
    tooltip.style.transform = 'translate(-50%, 0)';
    tooltip.setAttribute('data-visible', 'true');
  }

  function hideButtonTooltip() {
    const tooltip = document.body.querySelector(`[${TOOLTIP_ATTR}]`);
    if (!tooltip) {
      return;
    }

    tooltip.setAttribute('data-visible', 'false');
  }

  function ensureIframeWindowStylesLoaded() {
    if (document.head.querySelector('style[data-ddchromeext-iframe-style]')) {
      return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-ddchromeext-iframe-style', 'true');
    style.textContent =
      `[${IFRAME_WINDOW_ATTR}] {` +
      'position: fixed;' +
      'top: 60px;' +
      'left: 60px;' +
      'width: 900px;' +
      'height: 600px;' +
      'min-width: 320px;' +
      'min-height: 220px;' +
      'background: #111827;' +
      'border: 1px solid #374151;' +
      'border-radius: 6px;' +
      'box-shadow: 0 8px 32px rgba(0,0,0,0.6);' +
      'z-index: 2147483646;' +
      'display: flex;' +
      'flex-direction: column;' +
      'resize: both;' +
      'overflow: hidden;' +
      '}' +
      '[data-ddchromeext-iframe-titlebar] {' +
      'display: flex;' +
      'align-items: center;' +
      'justify-content: space-between;' +
      'padding: 6px 10px;' +
      'background: #1f2937;' +
      'cursor: move;' +
      'user-select: none;' +
      'border-bottom: 1px solid #374151;' +
      'flex-shrink: 0;' +
      '}' +
      '[data-ddchromeext-iframe-title] {' +
      'color: #f9fafb;' +
      'font-size: 12px;' +
      'overflow: hidden;' +
      'text-overflow: ellipsis;' +
      'white-space: nowrap;' +
      'flex: 1;' +
      'margin-right: 8px;' +
      '}' +
      '[data-ddchromeext-iframe-close],' +
      '[data-ddchromeext-iframe-minimize],' +
      '[data-ddchromeext-iframe-maximize],' +
      '[data-ddchromeext-iframe-snap-left],' +
      '[data-ddchromeext-iframe-snap-right] {' +
      'background: none;' +
      'border: none;' +
      'color: #9ca3af;' +
      'cursor: pointer;' +
      'padding: 2px 6px;' +
      'font-size: 14px;' +
      'border-radius: 3px;' +
      'line-height: 1;' +
      'flex-shrink: 0;' +
      '}' +
      '[data-ddchromeext-iframe-close]:hover,' +
      '[data-ddchromeext-iframe-minimize]:hover,' +
      '[data-ddchromeext-iframe-maximize]:hover,' +
      '[data-ddchromeext-iframe-snap-left]:hover,' +
      '[data-ddchromeext-iframe-snap-right]:hover {' +
      'color: #f9fafb;' +
      'background: #374151;' +
      '}' +
      `[${IFRAME_WINDOW_ATTR}][data-minimized="true"] {` +
      'position: fixed !important;' +
      'width: 260px !important;' +
      'height: auto !important;' +
      'min-height: 0 !important;' +
      'resize: none;' +
      'top: auto !important;' +
      'bottom: 8px !important;' +
      'border-radius: 6px;' +
      'box-shadow: 0 2px 8px rgba(0,0,0,0.45);' +
      '}' +
      `[${IFRAME_WINDOW_ATTR}][data-minimized="true"] [data-ddchromeext-iframe-el] {` +
      'display: none;' +
      '}' +
      `[${IFRAME_WINDOW_ATTR}][data-maximized="true"] {` +
      'top: 0 !important;' +
      'left: 0 !important;' +
      'width: 100vw !important;' +
      'height: 100vh !important;' +
      'border-radius: 0;' +
      'resize: none;' +
      '}' +
      '[data-ddchromeext-iframe-el] {' +
      'flex: 1;' +
      'border: none;' +
      'width: 100%;' +
      'display: block;' +
      '}';

    document.head.appendChild(style);
  }

  function findTraceIdIframeWindow(traceId) {
    return Array.from(document.body.querySelectorAll(`[${IFRAME_WINDOW_ATTR}]`)).find(
      (win) => win.getAttribute(IFRAME_WINDOW_TRACE_ATTR) === traceId
    ) || null;
  }

  function layoutMinimizedWindows() {
    const minimizedWindows = Array.from(
      document.body.querySelectorAll(`[${IFRAME_WINDOW_ATTR}][data-minimized="true"]`)
    );

    if (!minimizedWindows.length) {
      return;
    }

    const margin = 8;
    const gap = 8;
    const itemWidth = 260;
    const itemHeight = 38;
    const viewportWidth = Math.max(320, window.innerWidth || 320);

    let left = margin;
    let row = 0;

    minimizedWindows.forEach((win) => {
      if (left + itemWidth > viewportWidth - margin) {
        row += 1;
        left = margin;
      }

      win.style.left = `${left}px`;
      win.style.bottom = `${margin + row * (itemHeight + gap)}px`;
      win.style.top = 'auto';

      left += itemWidth + gap;
    });
  }

  function bringWindowToFront(win) {
    iframeWindowZIndexCounter += 1;
    win.style.zIndex = String(iframeWindowZIndexCounter);
  }

  function getNextWindowPosition() {
    const existingWindows = Array.from(
      document.body.querySelectorAll(`[${IFRAME_WINDOW_ATTR}]`)
    );
    const cascadeIndex = existingWindows.length % IFRAME_WINDOW_CASCADE_STEPS;

    return {
      top: IFRAME_WINDOW_BASE_TOP + cascadeIndex * IFRAME_WINDOW_CASCADE_OFFSET,
      left: IFRAME_WINDOW_BASE_LEFT + cascadeIndex * IFRAME_WINDOW_CASCADE_OFFSET
    };
  }

  function makeDraggable(floatingWin, handle) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    function onMouseMove(e) {
      if (!isDragging) {
        return;
      }
      floatingWin.style.left = `${startLeft + (e.clientX - startX)}px`;
      floatingWin.style.top = `${startTop + (e.clientY - startY)}px`;
    }

    function onMouseUp() {
      isDragging = false;
    }

    handle.addEventListener('mousedown', (e) => {
      if (floatingWin.getAttribute('data-minimized') === 'true') {
        return;
      }

      bringWindowToFront(floatingWin);
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = floatingWin.offsetLeft;
      startTop = floatingWin.offsetTop;
      e.preventDefault();
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    const removalObserver = new MutationObserver(() => {
      if (!document.body.contains(floatingWin)) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        removalObserver.disconnect();
      }
    });
    removalObserver.observe(document.body, { childList: true, subtree: true });
  }

  function openTraceIdInIframe(traceId) {
    const existing = findTraceIdIframeWindow(traceId);
    if (existing) {
      if (existing.getAttribute('data-minimized') === 'true') {
        existing.removeAttribute('data-minimized');
        if (existing.dataset.restoreWidth) {
          existing.style.width = existing.dataset.restoreWidth;
        }
        if (existing.dataset.restoreHeight) {
          existing.style.height = existing.dataset.restoreHeight;
        }
        if (existing.dataset.restoreLeft) {
          existing.style.left = existing.dataset.restoreLeft;
        }
        if (existing.dataset.restoreTop) {
          existing.style.top = existing.dataset.restoreTop;
        }
        existing.style.bottom = '';
        layoutMinimizedWindows();
      }

      bringWindowToFront(existing);
      return;
    }

    const url = buildLogsUrl(traceId);

    const win = document.createElement('div');
    win.setAttribute(IFRAME_WINDOW_ATTR, 'true');
    win.setAttribute(IFRAME_WINDOW_TRACE_ATTR, traceId);
    const nextPos = getNextWindowPosition();
    win.style.top = `${nextPos.top}px`;
    win.style.left = `${nextPos.left}px`;

    const titleBar = document.createElement('div');
    titleBar.setAttribute('data-ddchromeext-iframe-titlebar', 'true');

    const titleSpan = document.createElement('span');
    titleSpan.setAttribute('data-ddchromeext-iframe-title', 'true');
    titleSpan.textContent = `TraceId: ${traceId}`;

    function makeWinBtn(attr, ariaLabel, iconClass) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute(attr, 'true');
      btn.setAttribute('aria-label', ariaLabel);
      const icon = document.createElement('i');
      icon.className = iconClass;
      icon.setAttribute('aria-hidden', 'true');
      btn.appendChild(icon);
      return btn;
    }

    const minimizeBtn = makeWinBtn('data-ddchromeext-iframe-minimize', 'Minimize panel', 'fa-solid fa-window-minimize');
    const maximizeBtn = makeWinBtn('data-ddchromeext-iframe-maximize', 'Maximize panel', 'fa-solid fa-window-maximize');
    const snapLeftBtn = makeWinBtn('data-ddchromeext-iframe-snap-left', 'Snap left half', 'fa-solid fa-table-columns');
    const snapRightBtn = makeWinBtn('data-ddchromeext-iframe-snap-right', 'Snap right half', 'fa-solid fa-table-columns');
    const closeBtn = makeWinBtn('data-ddchromeext-iframe-close', 'Close panel', 'fa-solid fa-xmark');
    snapRightBtn.style.transform = 'scaleX(-1)';

    let savedWidth = '';
    let savedHeight = '';
    let savedLeft = '';
    let savedTop = '';

    function saveCurrentBounds() {
      savedWidth = win.style.width || `${win.offsetWidth}px`;
      savedHeight = win.style.height || `${win.offsetHeight}px`;
      savedLeft = win.style.left || `${win.offsetLeft}px`;
      savedTop = win.style.top || `${win.offsetTop}px`;
      win.dataset.restoreWidth = savedWidth;
      win.dataset.restoreHeight = savedHeight;
      win.dataset.restoreLeft = savedLeft;
      win.dataset.restoreTop = savedTop;
    }

    function restoreSavedBounds() {
      if (savedWidth) {
        win.style.width = savedWidth;
      }
      if (savedHeight) {
        win.style.height = savedHeight;
      }
      if (savedLeft) {
        win.style.left = savedLeft;
      }
      if (savedTop) {
        win.style.top = savedTop;
      }
      win.style.bottom = '';
    }

    function clearSnapState() {
      win.removeAttribute('data-snapped');
      snapLeftBtn.setAttribute('aria-label', 'Snap left half');
      snapRightBtn.setAttribute('aria-label', 'Snap right half');
    }

    function snapWindow(side) {
      const currentSnap = win.getAttribute('data-snapped');
      const isAlreadySnappedToSide = currentSnap === side;

      if (isAlreadySnappedToSide) {
        restoreSavedBounds();
        clearSnapState();
        bringWindowToFront(win);
        return;
      }

      if (win.getAttribute('data-minimized') === 'true') {
        win.removeAttribute('data-minimized');
        layoutMinimizedWindows();
      }

      win.removeAttribute('data-maximized');
      if (!currentSnap) {
        saveCurrentBounds();
      }

      const viewportWidth = Math.max(320, window.innerWidth || 320);
      const viewportHeight = Math.max(240, window.innerHeight || 240);
      const halfWidth = Math.floor(viewportWidth / 2);

      win.style.top = '0px';
      win.style.left = side === 'left' ? '0px' : `${halfWidth}px`;
      win.style.width = `${halfWidth}px`;
      win.style.height = `${viewportHeight}px`;
      win.style.bottom = '';
      win.setAttribute('data-snapped', side);
      snapLeftBtn.setAttribute(
        'aria-label',
        side === 'left' ? 'Restore panel' : 'Snap left half'
      );
      snapRightBtn.setAttribute(
        'aria-label',
        side === 'right' ? 'Restore panel' : 'Snap right half'
      );
      bringWindowToFront(win);
    }

    minimizeBtn.addEventListener('click', () => {
      const isMin = win.getAttribute('data-minimized') === 'true';
      if (isMin) {
        win.removeAttribute('data-minimized');
        restoreSavedBounds();
        win.removeAttribute('data-maximized');
        clearSnapState();
        layoutMinimizedWindows();
        bringWindowToFront(win);
        minimizeBtn.setAttribute('aria-label', 'Minimize panel');
        minimizeBtn.querySelector('i').className = 'fa-solid fa-window-minimize';
      } else {
        win.removeAttribute('data-maximized');
        clearSnapState();
        saveCurrentBounds();
        win.setAttribute('data-minimized', 'true');
        layoutMinimizedWindows();
        minimizeBtn.setAttribute('aria-label', 'Restore panel');
        minimizeBtn.querySelector('i').className = 'fa-solid fa-window-restore';
      }
    });

    maximizeBtn.addEventListener('click', () => {
      const isMax = win.getAttribute('data-maximized') === 'true';
      if (isMax) {
        win.removeAttribute('data-maximized');
        restoreSavedBounds();
        maximizeBtn.setAttribute('aria-label', 'Maximize panel');
        maximizeBtn.querySelector('i').className = 'fa-solid fa-window-maximize';
      } else {
        if (win.getAttribute('data-minimized') === 'true') {
          win.removeAttribute('data-minimized');
          restoreSavedBounds();
          layoutMinimizedWindows();
        }
        win.removeAttribute('data-minimized');
        clearSnapState();
        saveCurrentBounds();
        win.setAttribute('data-maximized', 'true');
        bringWindowToFront(win);
        maximizeBtn.setAttribute('aria-label', 'Restore panel');
        maximizeBtn.querySelector('i').className = 'fa-solid fa-window-restore';
      }
    });

    snapLeftBtn.addEventListener('click', () => {
      minimizeBtn.setAttribute('aria-label', 'Minimize panel');
      minimizeBtn.querySelector('i').className = 'fa-solid fa-window-minimize';
      maximizeBtn.setAttribute('aria-label', 'Maximize panel');
      maximizeBtn.querySelector('i').className = 'fa-solid fa-window-maximize';
      snapWindow('left');
    });

    snapRightBtn.addEventListener('click', () => {
      minimizeBtn.setAttribute('aria-label', 'Minimize panel');
      minimizeBtn.querySelector('i').className = 'fa-solid fa-window-minimize';
      maximizeBtn.setAttribute('aria-label', 'Maximize panel');
      maximizeBtn.querySelector('i').className = 'fa-solid fa-window-maximize';
      snapWindow('right');
    });

    closeBtn.addEventListener('click', () => {
      win.remove();
      layoutMinimizedWindows();
    });

    const btnGroup = document.createElement('div');
    btnGroup.style.cssText = 'display:flex;align-items:center;gap:2px;flex-shrink:0;';
    btnGroup.appendChild(minimizeBtn);
    btnGroup.appendChild(maximizeBtn);
    btnGroup.appendChild(snapLeftBtn);
    btnGroup.appendChild(snapRightBtn);
    btnGroup.appendChild(closeBtn);

    titleBar.appendChild(titleSpan);
    titleBar.appendChild(btnGroup);

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.setAttribute('data-ddchromeext-iframe-el', 'true');

    win.appendChild(titleBar);
    win.appendChild(iframe);
    document.body.appendChild(win);
    bringWindowToFront(win);
    win.addEventListener('mousedown', () => bringWindowToFront(win));

    makeDraggable(win, titleBar);
  }

  function isTraceIdKeyCell(keyCell) {
    const spanElements = keyCell.querySelectorAll('span');
    return Array.from(spanElements).some(
      (span) => span.textContent && span.textContent.trim() === 'TraceId'
    );
  }

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function buildLogsUrl(traceId) {
    const targetUrl = LOGS_URL_TEMPLATE.replace(
      '{TraceId}',
      encodeURIComponent(traceId)
    );

    const now = Date.now();
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
    const url = new URL(targetUrl);

    url.searchParams.set('from_ts', String(twoWeeksAgo));
    url.searchParams.set('to_ts', String(now));

    return url.toString();
  }

  function openTraceIdLogs(traceId) {
    window.open(buildLogsUrl(traceId), '_blank', 'noopener,noreferrer');
  }

  function attachTooltipHandlers(button) {
    button.addEventListener('mouseenter', () => {
      showButtonTooltip(button);
    });

    button.addEventListener('mouseleave', () => {
      hideButtonTooltip();
    });

    button.addEventListener('focus', () => {
      showButtonTooltip(button);
    });

    button.addEventListener('blur', () => {
      hideButtonTooltip();
    });
  }

  function extractTraceIdFromDashboardCell(cell) {
    const overflowerOriginal = cell.querySelector(
      'div[data-component-name="overflower-original"].druids_layout_overflower__original'
    );
    const jsonViewerValue = cell.querySelector(
      'span.druids_misc_json-viewer_value.druids_misc_json-viewer_value--string > div:not(.druids_dialogs_tooltip)'
    );

    const sourceText = normalizeText(
      (overflowerOriginal && overflowerOriginal.textContent) ||
        (jsonViewerValue && jsonViewerValue.textContent) ||
        cell.textContent
    );

    const hexMatch =
      sourceText.match(/\b[a-f0-9]{32}\b/i) ||
      sourceText.match(/\b[a-f0-9]{16,64}\b/i);

    if (hexMatch) {
      return hexMatch[0];
    }

    return sourceText.split(' ')[0] || '';
  }

  function injectDashboardTableButtons() {
    const tables = document.querySelectorAll('table.druids_table_table__table');

    tables.forEach((table) => {
      const headers = Array.from(table.querySelectorAll('thead th, th')).map((th) =>
        normalizeText(th.textContent)
      );

      const traceHeaderIndex = headers.findIndex((headerText) =>
        /traceidtraceid|@traceid@traceid|traceid/i.test(headerText)
      );

      if (traceHeaderIndex < 0) {
        return;
      }

      const rowsInTable = table.querySelectorAll('tbody tr');

      rowsInTable.forEach((tableRow) => {
        const cells = tableRow.querySelectorAll('td');
        if (!cells.length) {
          return;
        }

        let traceCell = cells[traceHeaderIndex] || null;
        let traceId = traceCell ? extractTraceIdFromDashboardCell(traceCell) : '';

        if (!traceCell || !traceId) {
          const fallbackCell = Array.from(cells)
            .slice(traceHeaderIndex)
            .find((cell) =>
              /[a-f0-9]{16,64}/i.test(normalizeText(cell.textContent))
            );

          traceCell = fallbackCell || null;
          traceId = traceCell ? extractTraceIdFromDashboardCell(traceCell) : '';
        }

        if (!traceCell || traceCell.querySelector(`[${DASHBOARD_BUTTON_ATTR}]`)) {
          return;
        }

        if (!traceId) {
          return;
        }

        const anchor = traceCell.querySelector('a.druids_table_table__cell-content');
        const appendTarget = anchor || traceCell;

        appendTarget.appendChild(createDashboardTraceIdButton(traceId));
        appendTarget.appendChild(createDashboardTraceIdIframeButton(traceId));
      });
    });
  }

  function createDashboardTraceIdButton(traceId) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className =
      'druids_form_button druids_form_button--sm druids_form_button--default druids_form_button--has-icon-only druids_form_button--is-naked';
    button.setAttribute(DASHBOARD_BUTTON_ATTR, 'true');
    button.setAttribute('aria-label', TOOLTIP_TEXT);
    button.style.marginLeft = '6px';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'druids_form_button__icon-wrapper';

    const maximizeIcon = document.createElement('i');
    maximizeIcon.className = 'fa-solid fa-maximize';
    maximizeIcon.style.fontSize = '12px';
    maximizeIcon.setAttribute('aria-hidden', 'true');

    iconWrapper.appendChild(maximizeIcon);
    button.appendChild(iconWrapper);

    attachTooltipHandlers(button);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      hideButtonTooltip();

      if (!traceId) {
        return;
      }

      openTraceIdLogs(traceId);
    });

    return button;
  }

  function createDashboardTraceIdIframeButton(traceId) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className =
      'druids_form_button druids_form_button--sm druids_form_button--default druids_form_button--has-icon-only druids_form_button--is-naked';
    button.setAttribute(DASHBOARD_IFRAME_BUTTON_ATTR, 'true');
    button.setAttribute('aria-label', IFRAME_TOOLTIP_TEXT);
    button.style.marginLeft = '4px';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'druids_form_button__icon-wrapper';

    const iframeIcon = document.createElement('i');
    iframeIcon.className = 'fa-solid fa-window-restore';
    iframeIcon.style.fontSize = '12px';
    iframeIcon.setAttribute('aria-hidden', 'true');

    iconWrapper.appendChild(iframeIcon);
    button.appendChild(iconWrapper);

    attachTooltipHandlers(button);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      hideButtonTooltip();

      if (!traceId) {
        return;
      }

      openTraceIdInIframe(traceId);
    });

    return button;
  }

  function getTraceIdFromValueCell(valueCell) {
    const valueDiv = valueCell.querySelector(
      '.druids_misc_json-viewer_value--string > div:not(.druids_dialogs_tooltip)'
    );

    if (!valueDiv || !valueDiv.textContent) {
      return '';
    }

    return valueDiv.textContent.trim();
  }

  function createTraceIdButton(valueCell) {
    const existingTooltip = valueCell.querySelector('.druids_dialogs_tooltip');
    if (!existingTooltip) {
      return null;
    }

    const existingButton = existingTooltip.querySelector('button');
    if (!existingButton) {
      return null;
    }

    const button = existingButton.cloneNode(true);

    const iconWrapper = button.querySelector('.druids_form_button__icon-wrapper');
    if (iconWrapper) {
      iconWrapper.textContent = '';
      const maximizeIcon = document.createElement('i');
      maximizeIcon.className = 'fa-solid fa-maximize';
      maximizeIcon.style.fontSize = '12px';
      maximizeIcon.setAttribute('aria-hidden', 'true');
      iconWrapper.appendChild(maximizeIcon);
    }

    button.type = 'button';
    button.setAttribute(BUTTON_ATTR, 'true');
    button.setAttribute('aria-label', TOOLTIP_TEXT);
    button.setAttribute('data-dd-action-name', 'Action');
    button.setAttribute('data-component-name', 'Button');
    button.removeAttribute('aria-describedby');

    attachTooltipHandlers(button);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      hideButtonTooltip();

      const traceId = getTraceIdFromValueCell(valueCell);

      if (!traceId) {
        return;
      }

      openTraceIdLogs(traceId);
    });

    return button;
  }

  function createTraceIdIframeButton(valueCell) {
    const existingTooltip = valueCell.querySelector('.druids_dialogs_tooltip');
    if (!existingTooltip) {
      return null;
    }

    const existingButton = existingTooltip.querySelector('button');
    if (!existingButton) {
      return null;
    }

    const button = existingButton.cloneNode(true);

    const iconWrapper = button.querySelector('.druids_form_button__icon-wrapper');
    if (iconWrapper) {
      iconWrapper.textContent = '';
      const iframeIcon = document.createElement('i');
      iframeIcon.className = 'fa-solid fa-window-restore';
      iframeIcon.style.fontSize = '12px';
      iframeIcon.setAttribute('aria-hidden', 'true');
      iconWrapper.appendChild(iframeIcon);
    }

    button.type = 'button';
    button.setAttribute(IFRAME_BUTTON_ATTR, 'true');
    button.setAttribute('aria-label', IFRAME_TOOLTIP_TEXT);
    button.setAttribute('data-dd-action-name', 'Action');
    button.setAttribute('data-component-name', 'Button');
    button.removeAttribute('aria-describedby');

    attachTooltipHandlers(button);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      hideButtonTooltip();

      const traceId = getTraceIdFromValueCell(valueCell);

      if (!traceId) {
        return;
      }

      openTraceIdInIframe(traceId);
    });

    return button;
  }

  function injectButtons() {
    const rows = document.querySelectorAll(ROW_SELECTOR);

    rows.forEach((row) => {
      const keyCell = row.querySelector(KEY_CELL_SELECTOR);
      const valueCell = row.querySelector(VALUE_CELL_SELECTOR);

      if (!keyCell || !valueCell || !isTraceIdKeyCell(keyCell)) {
        return;
      }

      if (valueCell.querySelector(`[${BUTTON_ATTR}]`)) {
        return;
      }

      const existingTooltip = valueCell.querySelector('.druids_dialogs_tooltip');
      if (!existingTooltip) {
        return;
      }

      const traceIdButton = createTraceIdButton(valueCell);
      if (!traceIdButton) {
        return;
      }

      existingTooltip.appendChild(traceIdButton);

      const iframeButton = createTraceIdIframeButton(valueCell);
      if (iframeButton) {
        existingTooltip.appendChild(iframeButton);
      }
    });

    injectDashboardTableButtons();
  }

  ensureFontAwesomeLoaded();
  ensureTooltipStylesLoaded();
  ensureIframeWindowStylesLoaded();
  window.addEventListener('resize', layoutMinimizedWindows);
  injectButtons();

  const observer = new MutationObserver(() => {
    injectButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
