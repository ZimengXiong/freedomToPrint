from PIL import Image, ImageDraw, ImageFont

WIDTH = 1200
HEIGHT = 630


def load_font(candidates, size):
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def text_size(draw, text, font, stroke_width=0):
    bbox = draw.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        w, _ = text_size(draw, trial, font)
        if w <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def create_og_image():
    img = Image.new("RGB", (WIDTH, HEIGHT), "#000000")
    draw = ImageDraw.Draw(img)

    # Grid background
    grid_color = "#1a1a1a"
    step = 40
    for x in range(0, WIDTH, step):
        draw.line([(x, 0), (x, HEIGHT)], fill=grid_color, width=1)
    for y in range(0, HEIGHT, step):
        draw.line([(0, y), (WIDTH, y)], fill=grid_color, width=1)

    # Outer border and red side rail
    draw.rectangle([(0, 0), (WIDTH - 1, HEIGHT - 1)], outline="#333333", width=2)
    draw.rectangle([(0, 0), (12, HEIGHT)], fill="#ff0000")

    font_headline = load_font(
        [
            "/System/Library/Fonts/Supplemental/Arial Black.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/Supplemental/Impact.ttf",
        ],
        92,
    )
    font_sub = load_font(
        [
            "/System/Library/Fonts/Supplemental/Courier New Bold.ttf",
            "/System/Library/Fonts/Courier.ttc",
        ],
        34,
    )

    x0 = 80
    vertical_offset = 34
    y0 = 90 + vertical_offset
    line_gap = 14

    line1 = "CODE IS SPEECH."
    line2 = "HARDWARE IS"
    line3 = "PRIVATE."

    # Headline block
    draw.text((x0, y0), line1, font=font_headline, fill="#ffffff")
    _, h1 = text_size(draw, line1, font_headline)
    y1 = y0 + h1 + line_gap
    draw.text((x0, y1), line2, font=font_headline, fill="#ffffff")
    _, h2 = text_size(draw, line2, font_headline)
    y2 = y1 + h2 + line_gap
    draw.text(
        (x0, y2),
        line3,
        font=font_headline,
        fill="#000000",
        stroke_width=5,
        stroke_fill="#ff0000",
    )
    _, h3 = text_size(draw, line3, font_headline, stroke_width=5)
    headline_bottom = y2 + h3

    # Sub-headline callout
    sub_text = "Reject mandatory telemetry and cloud-locking of additive manufacturing tools."
    sub_x = 80
    sub_y = headline_bottom + 36
    sub_w = 980
    inner_padding_x = 25
    inner_padding_y = 14
    inner_w = sub_w - inner_padding_x * 2
    wrapped = wrap_text(draw, sub_text, font_sub, inner_w)
    line_heights = [text_size(draw, line, font_sub)[1] for line in wrapped]
    text_block_h = sum(line_heights) + (len(wrapped) - 1) * 8
    sub_h = text_block_h + inner_padding_y * 2

    max_sub_bottom = HEIGHT - 58
    if sub_y + sub_h > max_sub_bottom:
        sub_y = max(40, max_sub_bottom - sub_h)

    draw.rectangle(
        [(sub_x, sub_y), (sub_x + sub_w, sub_y + sub_h)],
        fill=(8, 8, 8),
    )
    draw.rectangle(
        [(sub_x, sub_y), (sub_x + 6, sub_y + sub_h)],
        fill="#ffffff",
    )

    text_y = sub_y + inner_padding_y
    for i, line in enumerate(wrapped):
        draw.text((sub_x + inner_padding_x, text_y), line, font=font_sub, fill="#cccccc")
        text_y += line_heights[i] + 8

    img.save("public/og-preview.jpg", "JPEG", quality=84, optimize=True, progressive=True)


if __name__ == "__main__":
    create_og_image()
