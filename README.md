# Zed Champions Marketplace Rare and Super Rare Color Spy

A Tampermonkey script to identify and filter rare and super rare colored horses on the Zed Champions Marketplace, with scroll tracking and color counts.

## 📝 Overview

This [Tampermonkey](https://www.tampermonkey.net/) script enhances the Zed Champions Marketplace experience by allowing users to spot and filter horses with rare and super rare colors. It adds a sticky filter bar at the top of the marketplace page with buttons for each color, displaying counts of matching horses. Users can toggle filters to show only specific colors and track their scrolling progress.

### Features

- **Color Filters**: Buttons for rare (R) and super rare (SR) colors to filter horses.
- **Color Counts**: Displays the number of horses for each color (e.g., "Torch Red (3)").
- **Scroll Tracking**: Shows the number of horses scrolled past, visible horses, and total loaded horses.
- **Sticky UI**: Filter bar stays at the top of the page while scrolling.
- **Responsive Design**: Buttons and status wrap to fit the screen width.

## Installation

1. **Install Tampermonkey**:
   - Install the Tampermonkey extension for your browser:
     - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
     - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
     - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
     - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. **Add the Script**:
   - Click the Tampermonkey icon in your browser and select **"Create a new script..."**.
   - Copy and paste the entire script code into the editor.
   - Save the script (`Ctrl+S` or `Cmd+S`).

3. **Visit the Marketplace**:
   - Go to [https://app.zedchampions.com/marketplace](https://app.zedchampions.com/marketplace).
   - The filter bar should automatically appear at the top of the page.

## Usage

1. **Filter by Color**:
   - A filter bar appears at the top of the marketplace page with buttons labeled by color (e.g., "Torch Red", "Black").
   - Click a button to filter horses to only show those with the selected color.
   - Click the button again to deselect and show all horses.
   - Multiple colors can be selected at once.

2. **Monitor Counts**:
   - Each button shows the count of loaded horses with that color (e.g., "Aqua (2)").
   - Counts update as you scroll and more horses load.

3. **Track Scrolling**:
   - The status box at the end of the filter bar shows:
     - Number of horses scrolled past (e.g., "180").
     - Visible horses after filtering / Total loaded horses (e.g., "180/180").
     - "H" for "Horses".

4. **Responsive Layout**:
   - The filter bar wraps to fit smaller screens while remaining sticky at the top.

## Styling

- **Filter Bar**:

- **Labels ("R" and "SR")**:

- **Color Buttons**:

- **Status Box**:

## Script Details

- **1.8** (as of the script’s metadata)

## Known Issues

- If the marketplace uses virtualization (removing cards from the DOM when not in view), counts may not reflect all horses. This script assumes all loaded cards remain in the DOM.
- On very narrow screens, the filter bar may wrap more frequently; adjust browser width if needed.
- Make sure to activate developer mode in the tampermonkey extension.

## Contributing

Feel free to fork this repository, make improvements, and submit a pull request. Suggestions for features or bug fixes are welcome via issues.

## License
This script is provided as-is, with no warranty. Use at your own risk.
