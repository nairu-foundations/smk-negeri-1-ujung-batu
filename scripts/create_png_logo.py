import zlib
import struct
import math

def create_png():
    width = 512
    height = 560
    
    # Buat buffer piksel RGBA
    pixels = bytearray(width * height * 4)

    def set_pixel(x, y, r, g, b, a):
        if 0 <= x < width and 0 <= y < height:
            idx = (y * width + x) * 4
            # Alpha blending
            sa = a / 255.0
            da = pixels[idx + 3] / 255.0
            out_a = sa + da * (1.0 - sa)
            if out_a > 0:
                out_r = (r * sa + pixels[idx] * da * (1.0 - sa)) / out_a
                out_g = (g * sa + pixels[idx + 1] * da * (1.0 - sa)) / out_a
                out_b = (b * sa + pixels[idx + 2] * da * (1.0 - sa)) / out_a
                pixels[idx] = int(min(255, max(0, out_r)))
                pixels[idx + 1] = int(min(255, max(0, out_g)))
                pixels[idx + 2] = int(min(255, max(0, out_b)))
                pixels[idx + 3] = int(min(255, max(0, out_a * 255)))

    # Koordinat pusat
    cx = width // 2
    
    # 1. Gambar perisai (Shield)
    for y in range(height):
        for x in range(width):
            nx = (x - cx) / 200.0
            ny = (y - 30) / 480.0
            
            # Persamaan bentuk perisai segilima
            in_shield_outer = False
            in_shield_inner = False
            
            if 0 <= ny <= 1.0:
                # Lebar perisai berdasarkan kedalaman y
                if ny < 0.65:
                    w_factor = 1.0 - 0.12 * (ny / 0.65) ** 2
                else:
                    # Menyempit ke titik bawah
                    w_factor = 0.88 * (1.0 - ((ny - 0.65) / 0.35) ** 1.3)
                
                # Jarak horizontal ternormalisasi
                d = abs(nx)
                if d <= w_factor:
                    in_shield_outer = True
                    if d <= w_factor - 0.08 and 0.025 <= ny <= 0.94:
                        in_shield_inner = True
            
            if in_shield_outer:
                if not in_shield_inner:
                    # Border emas
                    gold_t = (x + y) / (width + height)
                    r = int(255 - 40 * gold_t)
                    g = int(190 - 50 * gold_t)
                    b = int(20)
                    set_pixel(x, y, r, g, b, 255)
                else:
                    # Isi dalam biru dongker gradasi almamater
                    blue_t = y / float(height)
                    r = int(5 + 10 * blue_t)
                    g = int(35 + 15 * blue_t)
                    b = int(120 - 45 * blue_t)
                    set_pixel(x, y, r, g, b, 255)

    # 2. Gambar Roda Gigi (Gear) di tengah
    gear_cy = 265
    gear_r_outer = 90
    gear_r_inner = 55
    for y in range(gear_cy - 100, gear_cy + 100):
        for x in range(cx - 100, cx + 100):
            dx = x - cx
            dy = y - gear_cy
            dist = math.hypot(dx, dy)
            angle = math.atan2(dy, dx)
            
            # 16 gigi
            teeth = math.cos(angle * 16)
            cur_r = 82 + 9 * teeth
            if dist <= cur_r and dist >= 45:
                # Warna emas baja
                set_pixel(x, y, 245, 180, 20, 255)
            elif dist < 45 and dist >= 40:
                set_pixel(x, y, 255, 255, 255, 255)

    # 3. Bintang di bagian atas (Star)
    star_cy = 120
    for y in range(star_cy - 25, star_cy + 25):
        for x in range(cx - 25, cx + 25):
            dx = x - cx
            dy = y - star_cy
            dist = math.hypot(dx, dy)
            angle = math.atan2(dy, dx) - math.pi / 2
            # 5-pointed star
            r_star = 16 * (math.cos(5 * angle) * 0.45 + 0.55)
            if dist <= r_star + 4:
                set_pixel(x, y, 255, 220, 50, 255)

    # 4. Obor / Api (Torch flame)
    torch_cy = 240
    for y in range(torch_cy - 50, torch_cy + 20):
        for x in range(cx - 25, cx + 25):
            dx = abs(x - cx)
            dy = torch_cy - y
            if dy > 0:
                flame_w = 18 * (1.0 - (dy / 55.0)) * math.sin(dy * 0.08)
                if dx <= abs(flame_w):
                    # Gradasi merah ke kuning
                    t = dy / 50.0
                    r = int(240 + 15 * t)
                    g = int(40 + 190 * t)
                    b = int(20)
                    set_pixel(x, y, r, g, b, 255)

    # 5. Buku Terbuka (Open book)
    book_y = 315
    for y in range(book_y - 12, book_y + 16):
        for x in range(cx - 70, cx + 70):
            dx = abs(x - cx)
            if 4 <= dx <= 65 and y >= book_y - 5:
                set_pixel(x, y, 255, 255, 255, 255)

    # 6. Pita Bawah (Ribbon)
    ribbon_y = 435
    for y in range(ribbon_y - 16, ribbon_y + 18):
        for x in range(cx - 150, cx + 150):
            dx = abs(x - cx)
            curve = (dx / 150.0) ** 2 * 14
            if abs((y - ribbon_y) - curve) < 14:
                # Warna putih pita dengan lis emas
                edge = abs((y - ribbon_y) - curve)
                if edge > 11:
                    set_pixel(x, y, 217, 119, 6, 255)
                else:
                    set_pixel(x, y, 255, 255, 255, 255)

    # Tulis PNG murni (header, IHDR, IDAT, IEND)
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # filter byte: None
        start = y * width * 4
        raw_data.extend(pixels[start:start + width * 4])

    compressed = zlib.compress(bytes(raw_data), 9)
    
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png_bytes = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')

    with open('public/images/logo/logo-smkn1.png', 'wb') as f:
        f.write(png_bytes)
    with open('public/images/logo/tut-wuri.png', 'wb') as f:
        f.write(png_bytes)
    print("✅ Berhasil membuat public/images/logo/logo-smkn1.png dan tut-wuri.png")

if __name__ == '__main__':
    create_png()
