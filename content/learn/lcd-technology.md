---
title: "LCD Display Technology Guide | Types & How It Works"
description: "Complete guide to LCD technology. Character LCD, graphic LCD, STN, FSTN, TN types explained. Selection criteria for engineers. Expert guide."
keywords: ["LCD display technology", "how LCD works", "LCD types explained", "character vs graphic LCD"]
url: "/learn/lcd-technology"
schema: ["TechArticle", "FAQPage", "BreadcrumbList"]
---

# LCD Display Technology: A Comprehensive Guide

Liquid Crystal Display (LCD) technology is the foundational display technology that underpins everything from simple two-line character readouts on industrial equipment to high-resolution TFT panels in medical devices. While TFT LCDs dominate the color display market, passive-matrix LCDs — character and graphic types — remain essential for millions of products where simplicity, low cost, low power, and proven reliability are priorities.

This guide covers the fundamentals of LCD technology, the distinction between active and passive matrix, character and graphic LCD types, the passive LCD variants (TN, STN, FSTN), backlighting options, and practical guidance for selecting the right LCD for your application.

## How Liquid Crystal Displays Work

### Liquid Crystal Fundamentals

Liquid crystals are materials that exist in a state between solid and liquid. Their molecules have an elongated shape that allows them to flow like a liquid while maintaining a degree of molecular ordering like a crystal. Critically, this molecular alignment can be controlled by applying an electric field.

In an LCD, a thin layer of liquid crystal material is sandwiched between two glass substrates with transparent electrodes. Polarizing filters on the front and rear of the assembly are oriented perpendicular to each other. Without any electrical influence, the liquid crystal molecules are arranged (by alignment layers on the glass surfaces) to twist the polarization of light passing through, allowing it to pass through both polarizers. When an electric field is applied via the electrodes, the molecules realign, changing the polarization rotation and reducing the light transmission — creating a dark pixel.

This is the basic operating principle of all LCD technologies. The variations — TN, STN, FSTN, IPS, VA — differ in how the liquid crystal molecules are aligned and switched, producing different optical characteristics.

### Passive Matrix vs. Active Matrix

**Passive matrix** LCDs address pixels by energizing row and column electrodes in sequence. Each pixel is only actively driven for a fraction of the frame period (1/N of the time, where N is the number of rows). This limits contrast, response time, and practical resolution. Passive matrix is used in character LCDs and graphic LCDs.

**Active matrix** (TFT) LCDs place a thin-film transistor at each pixel that acts as a switch and charge storage element. Each pixel maintains its state for the full frame period, enabling high contrast, fast response, and high resolution. Active matrix is covered in detail in our [TFT display technology guide](/learn/tft-display-technology).

## Character LCD Displays

[Character LCDs](/products/character-lcd) display alphanumeric text and a limited set of custom symbols using a fixed character matrix. Each character position is a grid of dots (typically 5×8 pixels) that renders one character from a built-in character generator ROM.

### Common Configurations

| Format | Characters | Typical Use |
|--------|-----------|-------------|
| 8×1 | 8 characters, 1 line | Minimal status display |
| 16×2 | 16 characters, 2 lines | The most common configuration. Equipment status, parameter readouts |
| 20×4 | 20 characters, 4 lines | Multi-parameter instruments, menu systems |
| 40×4 | 40 characters, 4 lines | Data-rich text interfaces, terminal emulation |

### Character LCD Controllers

Most character LCDs use the HD44780 controller or a compatible variant. This controller:
- Stores a standard character set (ASCII, Japanese kana, European characters)
- Supports up to 8 custom-defined characters (user-defined pixel patterns)
- Communicates via 4-bit or 8-bit parallel interface
- Manages character rendering internally — the host processor sends character codes, not pixel data

This simplicity is a key advantage: a character LCD can be driven by the simplest microcontrollers with minimal code and no frame buffer memory.

### When to Choose Character LCD

- Text-only display requirements (values, labels, status messages)
- Cost-sensitive designs where every cent matters
- Extremely low power requirements (especially without backlight)
- Simple host processor with limited resources
- Proven, long-lifecycle component needs

## Graphic LCD Displays

[Graphic LCDs](/products/graphic-lcd) address individual pixels across the entire display area, enabling display of text (in any font, size, or orientation), graphics, icons, bar graphs, waveforms, and any visual content the application requires.

### Graphic LCD Technologies

**STN (Super Twisted Nematic).** An enhancement of standard TN technology that increases the twist angle of the liquid crystal molecules from 90° to 180-270°. This higher twist angle produces steeper voltage-transmission curves, enabling higher multiplexing ratios and sharper contrast in passive-matrix displays. STN panels have a characteristic color tint — yellow-green or blue — depending on the polarizer orientation.

**FSTN (Film-compensated STN).** Adds a retardation film to the STN panel that compensates for the color dispersion inherent in STN technology. The result is a true black-on-white (or white-on-black) display without the colored tint of standard STN. FSTN provides the sharpest contrast of the passive LCD technologies and is preferred for most graphic LCD applications.

**DSTN (Double-layer STN).** Uses two STN cells stacked together for color compensation. Largely superseded by FSTN, which achieves similar results with less complexity and thickness.

### Graphic LCD Construction

**COG (Chip-on-Glass).** The LCD controller IC is mounted directly on the glass substrate. COG construction produces the thinnest possible LCD module — as thin as 2 mm — making it ideal for space-constrained products. The trade-off is a more complex FPC connection to the host system.

**COB (Chip-on-Board).** The controller IC is mounted on a small PCB that attaches to the LCD glass via a flex cable or pin header. COB construction is slightly thicker but offers easier integration with standard connectors.

**TAB (Tape Automated Bonding).** The controller IC is mounted on a flexible tape carrier. TAB offers a middle ground between COG thinness and COB ease of connection.

### Common Graphic LCD Resolutions

| Resolution | Typical Size | Use Cases |
|-----------|-------------|-----------|
| 128×64 | 2.4" - 3.2" | Instruments, metering, simple UI |
| 128×128 | 1.5" - 2.0" | Wearables, compact instruments |
| 240×128 | 4.0" - 5.0" | Industrial controls, medical devices |
| 320×240 | 5.7" - 6.2" | Complex instruments, data display |
| 640×480 | 5.7" - 10.4" | High-density data, graphics |

### When to Choose Graphic LCD

- Need graphics, custom fonts, or flexible layout (but don't need color)
- Lower cost than TFT is required
- Low to moderate power budget
- Excellent sunlight readability needed (reflective mode)
- Wide temperature range with proven reliability

## LCD Backlighting Options

LCD panels modulate light but don't generate it. Backlighting (or ambient light reflection) makes the display content visible.

### Backlight Types

**LED backlight.** The standard for modern LCD displays. White LEDs on a light guide plate provide uniform illumination. Long lifetime (50,000+ hours), dimmable, and efficient. Available as edge-lit or bottom-lit configurations.

**No backlight (reflective).** Reflective LCDs use ambient light reflected from a mirror layer behind the LCD to illuminate the display. Zero power consumption for illumination — the display is visible whenever ambient light is sufficient. Used in outdoor instruments, meters, and ultra-low-power applications.

**Transflective.** Combines reflective and transmissive modes. Readable in ambient light using reflection, with an LED backlight available for low-light conditions. The best of both worlds for portable instruments that operate in varied lighting.

### Backlight Colors

LED backlights are available in multiple colors:
- **White** — Standard for most applications
- **Yellow-green** — Traditional LCD backlight color, high efficiency
- **Blue** — Stylistic choice for some instruments
- **Red** — Night vision compatibility, darkroom use
- **Amber** — Automotive and aviation applications

## Display Modes

LCD display mode describes the optical appearance — how pixels appear in their ON and OFF states:

**Positive mode.** Dark characters on a light background. The natural mode for reflective displays viewed in ambient light. Standard for readability in well-lit environments.

**Negative mode.** Light characters on a dark background. Requires backlighting for visibility. Higher contrast appearance; preferred for dark environments and when visual impact is desired.

**Transmissive.** Designed for backlit viewing only. No reflective layer. Best contrast and uniformity under backlit conditions.

**Reflective.** Designed for ambient light viewing only. No backlight. Lowest power consumption.

**Transflective.** Combines transmissive and reflective. Readable under both conditions with moderate performance in each mode.

## LCD Interface Options

### Parallel Interface (4-bit and 8-bit)
The traditional character LCD interface. 4-bit mode uses 4 data lines plus control signals (RS, R/W, E); 8-bit mode uses 8 data lines. Simple, well-supported by virtually every microcontroller.

### SPI
Serial interface using clock, data, and chip-select lines. Common on graphic LCDs where pin count reduction is valuable. Higher data rates than parallel for graphic content.

### I2C
Two-wire serial interface. Minimal pin count but lower bandwidth. Suitable for character LCDs and small graphic LCDs with infrequent updates.

## LCD vs. Other Display Technologies

### LCD vs. OLED
- **LCD** — Lower cost, proven reliability, no burn-in, reflective mode available, wider size range
- **OLED** — Higher contrast (true black), thinner, self-emitting (no backlight), wider viewing angles, susceptible to burn-in

Choose LCD when cost, reliability, sunlight readability (reflective mode), and long lifecycle are priorities. Choose [OLED](/learn/oled-technology) when contrast, thinness, and viewing angles are priorities.

### LCD vs. TFT LCD
TFT LCD is a type of LCD — specifically, an active-matrix LCD. When comparing "LCD" (meaning passive-matrix character or graphic LCD) to TFT:
- **Passive LCD** — Lower cost, simpler interface, lower power, proven for text and simple graphics
- **TFT LCD** — Full color, high resolution, fast response, complex graphics and video capability

Choose passive LCD for text, simple graphics, and cost-sensitive designs. Choose [TFT](/learn/tft-display-technology) when you need color, high resolution, or rich graphical content.

## Frequently Asked Questions

### What's the difference between character LCD and graphic LCD?
Character LCDs display predefined characters from a built-in font in fixed positions (e.g., 16 characters × 2 lines). Graphic LCDs address individual pixels, allowing any visual content — text in any font, graphics, icons, waveforms. Character LCDs are simpler and cheaper; graphic LCDs are more flexible.

### How long do LCD displays last?
LCD panels themselves have essentially unlimited life — the liquid crystal material doesn't degrade under normal use. The limiting component is the LED backlight, typically rated at 50,000-100,000 hours to 50% brightness. Reflective LCDs with no backlight can operate indefinitely.

### Can LCD displays work in extreme cold?
LCD response time slows significantly below -20°C. Extended-range LCD panels are specified to -30°C or -40°C with acceptable performance. Heater elements can be added for cold-start operation. For details, see our [harsh environment display guide](/applications/harsh-environments).

### What is FSTN and why does it matter?
FSTN (Film-compensated Super Twisted Nematic) adds a retardation film to standard STN LCD panels that corrects the color tint inherent in STN technology. The result is clean black-on-white or white-on-black appearance without the yellow-green or blue tint. FSTN is the preferred technology for most graphic LCD applications requiring clear, high-contrast monochrome display.

### Do LCD displays suffer from burn-in?
LCD panels can experience temporary image retention (a faint ghost of a static image) but not permanent burn-in like OLED or plasma displays. Image retention in LCDs clears when the display content changes or the display is powered off. For long-term static content, screen savers or periodic content cycling prevent even temporary retention.

---

*Explore our LCD product lines: [Character LCD displays](/products/character-lcd) | [Graphic LCD displays](/products/graphic-lcd) | [Contact us](/contact) for selection guidance*
