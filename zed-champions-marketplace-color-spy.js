// ==UserScript==
// @name         Zed Champions Marketplace Rare and Super Rare Color Spy
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Notice rare and super rare color horses on Zed Champions Marketplace, with scroll tracking and color counts
// @match        https://app.zedchampions.com/marketplace*
// @author       Ryya
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const rareColors = {
        rare: {
            '#ff1744': 'Torch Red',
            '#f50057': 'Razzmatazz',
            '#18ffff': 'Aqua',
            '#00e5ff': 'Cyan',
            '#e040fb': 'Heliotrope',
            '#7c4dff': 'Prelude',
            '#c6ff00': 'Electric Lime',
            '#ffff00': 'Shalimar'
        },
        superRare: {
            '#d50000': 'Guardsman Red',
            '#000000': 'Black',
            '#2962ff': 'Wild Blue Yonder',
            '#757575': 'Boulder',
            '#aa00ff': 'Electric Violet',
            '#ffffff': 'White',
            '#ffcd00': 'Golf',
            '#bdbdbd': 'Silver'
        }
    };

    const REFRESH_INTERVAL = 1000;
    const DEBOUNCE_TIME = 300;

    let selectedColors = [];
    let scrolledCount = 0;
    let colorCounts = {};
    let colorButtons = {};
    let debounceTimer, statusBox;

    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => [...p.querySelectorAll(s)];

    function getColor(card) {
        const colorLayer = card.querySelector('div[style*="mask-image"][style*="background-color"]');
        if (!colorLayer) return null;
        const bg = colorLayer.style.backgroundColor;
        const match = bg.match(/rgb\((\d+), (\d+), (\d+)\)/);
        if (!match) return null;
        const [_, r, g, b] = match.map(Number);
        const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
        return hex.toLowerCase();
    }

    function initializeColorCounts() {
        Object.keys(rareColors.rare).forEach(hex => {
            colorCounts[hex] = 0;
        });
        Object.keys(rareColors.superRare).forEach(hex => {
            colorCounts[hex] = 0;
        });
    }

    function updateScrolledCount() {
        const cards = $$('.css-10klw3m');

        // Reset color counts to 0
        Object.keys(colorCounts).forEach(hex => {
            colorCounts[hex] = 0;
        });

        // Count scrolled cards
        scrolledCount = 0;
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.bottom < 0) {
                scrolledCount++;
            }
        });

        // Count colors for ALL loaded cards (not just scrolled ones)
        cards.forEach(card => {
            const color = getColor(card);
            if (color && colorCounts.hasOwnProperty(color)) {
                colorCounts[color]++;
            }
        });

        // Update color buttons with counts
        Object.keys(colorCounts).forEach(hex => {
            const button = colorButtons[hex];
            if (button) {
                const baseName = button.getAttribute('data-base-name');
                button.textContent = `${baseName} (${colorCounts[hex]})`;
            }
        });

        updateStatus();
    }

    function updateStatus() {
        const cards = $$('.css-10klw3m');
        const total = cards.length;
        const visible = cards.filter(c => !c.classList.contains('zed-card-hidden')).length;
        statusBox.textContent = `${scrolledCount} | ${visible}/${total} H`;
    }

    function debounce(fn) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fn, DEBOUNCE_TIME);
    }

    function filterCards() {
        const cards = $$('.css-10klw3m');

        cards.forEach(card => {
            const color = getColor(card);
            const colorMatch = selectedColors.length === 0 || (color && selectedColors.includes(color));
            card.classList.toggle('zed-card-hidden', !colorMatch);
        });

        updateScrolledCount();
    }

    function toggleColorFilter(color, button) {
        const idx = selectedColors.indexOf(color);
        if (idx >= 0) {
            selectedColors.splice(idx, 1);
            button.classList.remove('active');
        } else {
            selectedColors.push(color);
            button.classList.add('active');
        }
        debounce(filterCards);
    }

    const style = `
    .zed-filter-container {
        position: sticky;
        top: 0;
        z-index: 9999;
        background: #000000;
        color: white;
        display: flex;
        flex-wrap: wrap;
        gap: 10px 20px;
        padding: 12px 20px;
        padding-left: 6px;
        border-bottom: 1px solid #2D3748;
    }
    .zed-filter-group {
        display: flex;
        flex-wrap: wrap; /* Allow wrapping within the group */
        gap: 6px;
        align-items: center;
    }
    .zed-color-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
    }
    .zed-filter-btn {
        background: #293133;
        color: white;
        font-weight: bold;
        padding: 0 6px;
        border: none;
        border-radius: 0px;
        cursor: pointer;
        font-size: 9px;
        min-width: 20px;
        text-align: center;
        margin-right: 6px;
        margin-bottom: 6px;
        height: 20px;
        line-height: 20px;
    }
    .zed-filter-btn.active {
        background: linear-gradient(to right,
            #9ce09b 0%,
            #9ce09b 20%,
            #74c9d4 45%,
            #6abfd9 55%,
            #5fc9d4 70%,
            #6abfd9 100%);
        color: black;
        font-weight: bold;
    }
    .zed-filter-btn.invert-text {
        color: black;
    }
    .zed-status-box {
        background: #293133;
        color: gray;
        padding: 0 6px;
        border-radius: 0;
        font-size: 9px;
        font-weight: bold;
        min-width: 94px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        margin-right: 6px;
        margin-bottom: 6px;
        box-sizing: border-box;
    }
    .zed-card-hidden {
        display: none !important;
    }
    .zed-label {
        font-size: 11px; /* Increased to 11px as requested */
        font-weight: bold;
        color: gray; /* Changed to gray as requested */
        padding: 0 6px;
        height: 20px;
        line-height: 20px;
        margin-right: 6px;
        margin-bottom: 6px;
    }
    `;

    function createUI() {
        const container = document.createElement('div');
        container.className = 'zed-filter-container';

        const colorGroup = document.createElement('div');
        colorGroup.className = 'zed-filter-group';

        const colorRow = document.createElement('div');
        colorRow.className = 'zed-color-row';

        // "R" label at the start
        const rareLabel = document.createElement('span');
        rareLabel.className = 'zed-label';
        rareLabel.textContent = 'R';
        colorRow.appendChild(rareLabel);

        // Rare Colors
        for (const [hex, name] of Object.entries(rareColors.rare)) {
            const button = document.createElement('button');
            button.className = 'zed-filter-btn';
            button.style.backgroundColor = hex;
            button.textContent = `${name} (0)`;
            button.setAttribute('data-base-name', name);
            colorButtons[hex] = button;

            const invertColors = ['aqua', 'cyan', 'white', 'electric lime', 'shalimar'];
            if (invertColors.includes(name.toLowerCase())) {
                button.classList.add('invert-text');
            }

            button.addEventListener('click', () => toggleColorFilter(hex, button));
            colorRow.appendChild(button);
        }

        // "SR" label
        const superRareLabel = document.createElement('span');
        superRareLabel.className = 'zed-label';
        superRareLabel.textContent = 'SR';
        colorRow.appendChild(superRareLabel);

        // Super Rare Colors
        for (const [hex, name] of Object.entries(rareColors.superRare)) {
            const button = document.createElement('button');
            button.className = 'zed-filter-btn';
            button.style.backgroundColor = hex;
            button.textContent = `${name} (0)`;
            button.setAttribute('data-base-name', name);
            colorButtons[hex] = button;

            const invertColors = ['white'];
            if (invertColors.includes(name.toLowerCase())) {
                button.classList.add('invert-text');
            }

            button.addEventListener('click', () => toggleColorFilter(hex, button));
            colorRow.appendChild(button);
        }

        // Status Box
        statusBox = document.createElement('div');
        statusBox.className = 'zed-status-box';
        colorRow.appendChild(statusBox);

        colorGroup.appendChild(colorRow);
        container.appendChild(colorGroup);

        const target = document.querySelector('main') || document.body;
        target.prepend(container);
    }

    function init() {
        if (!window.location.href.includes('zedchampions.com/marketplace')) return;
        initializeColorCounts();
        document.head.insertAdjacentHTML('beforeend', `<style>${style}</style>`);
        createUI();
        new MutationObserver(() => debounce(filterCards)).observe(document.body, { childList: true, subtree: true });
        window.addEventListener('scroll', () => debounce(updateScrolledCount));
        filterCards();
        setInterval(() => debounce(filterCards), REFRESH_INTERVAL);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();