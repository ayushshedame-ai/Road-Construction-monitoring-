/**
 * RoadSight Pure JavaScript EXIF GPS Extractor
 * Reads embedded GPS latitude, longitude, and timestamp from JPEG EXIF metadata.
 */

export function extractExifGps(file) {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.includes('jpeg') && !file.type.includes('jpg')) {
      resolve({ hasGps: false, reason: 'NOT_JPEG' });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const view = new DataView(e.target.result);

        // Check JPEG SOI marker (0xFFD8)
        if (view.getUint16(0, false) !== 0xFFD8) {
          resolve({ hasGps: false, reason: 'INVALID_JPEG' });
          return;
        }

        let offset = 2;
        const length = view.byteLength;

        while (offset < length) {
          if (view.getUint8(offset) !== 0xFF) {
            resolve({ hasGps: false, reason: 'NO_MARKER' });
            return;
          }

          const marker = view.getUint8(offset + 1);

          // APP1 Marker (0xFFE1) contains EXIF
          if (marker === 0xE1) {
            const exifLength = view.getUint16(offset + 2, false);
            const exifStart = offset + 4;

            // Check "Exif\0\0" header
            const header = String.fromCharCode(
              view.getUint8(exifStart),
              view.getUint8(exifStart + 1),
              view.getUint8(exifStart + 2),
              view.getUint8(exifStart + 3)
            );

            if (header !== 'Exif') {
              resolve({ hasGps: false, reason: 'NO_EXIF_HEADER' });
              return;
            }

            const tiffStart = exifStart + 6;
            const bigEndian = view.getUint16(tiffStart, false) === 0x4D4D; // "MM" vs "II"

            // Check TIFF 42 marker
            if (view.getUint16(tiffStart + 2, bigEndian) !== 0x002A) {
              resolve({ hasGps: false, reason: 'INVALID_TIFF' });
              return;
            }

            const ifd0Offset = view.getUint32(tiffStart + 4, bigEndian);
            let gpsOffset = null;

            // Read IFD0 tags
            const ifd0Start = tiffStart + ifd0Offset;
            const numEntries = view.getUint16(ifd0Start, bigEndian);

            for (let i = 0; i < numEntries; i++) {
              const tagOffset = ifd0Start + 2 + i * 12;
              const tag = view.getUint16(tagOffset, bigEndian);

              // GPS Info Tag is 0x8825 (34853)
              if (tag === 0x8825) {
                gpsOffset = view.getUint32(tagOffset + 8, bigEndian);
                break;
              }
            }

            if (!gpsOffset) {
              resolve({ hasGps: false, reason: 'NO_GPS_TAG' });
              return;
            }

            // Read GPS IFD
            const gpsStart = tiffStart + gpsOffset;
            const numGpsEntries = view.getUint16(gpsStart, bigEndian);

            let latRef = 'N';
            let lonRef = 'E';
            let latValues = null;
            let lonValues = null;

            for (let i = 0; i < numGpsEntries; i++) {
              const entryOffset = gpsStart + 2 + i * 12;
              const tag = view.getUint16(entryOffset, bigEndian);
              const valueOffset = view.getUint32(entryOffset + 8, bigEndian);

              if (tag === 0x0001) {
                // GPSLatitudeRef ('N' or 'S')
                latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
              } else if (tag === 0x0002) {
                // GPSLatitude (3 rational numbers: degrees, minutes, seconds)
                latValues = readRationals(view, tiffStart + valueOffset, 3, bigEndian);
              } else if (tag === 0x0003) {
                // GPSLongitudeRef ('E' or 'W')
                lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
              } else if (tag === 0x0004) {
                // GPSLongitude (3 rational numbers)
                lonValues = readRationals(view, tiffStart + valueOffset, 3, bigEndian);
              }
            }

            if (latValues && lonValues) {
              let lat = latValues[0] + latValues[1] / 60.0 + latValues[2] / 3600.0;
              if (latRef === 'S') lat = -lat;

              let lon = lonValues[0] + lonValues[1] / 60.0 + lonValues[2] / 3600.0;
              if (lonRef === 'W') lon = -lon;

              resolve({
                hasGps: true,
                lat: Number(lat.toFixed(6)),
                lng: Number(lon.toFixed(6)),
                source: 'photo_exif',
                sourceLabel: 'Photo EXIF Metadata (Embedded)'
              });
              return;
            }

            resolve({ hasGps: false, reason: 'GPS_COORDS_MISSING' });
            return;
          }

          // Move to next JPEG marker
          offset += 2 + view.getUint16(offset + 2, false);
        }

        resolve({ hasGps: false, reason: 'APP1_NOT_FOUND' });
      } catch (err) {
        console.warn('EXIF parse note:', err);
        resolve({ hasGps: false, reason: 'PARSE_ERROR' });
      }
    };

    reader.onerror = () => resolve({ hasGps: false, reason: 'FILE_READ_ERROR' });
    reader.readAsArrayBuffer(file.slice(0, 128 * 1024)); // Read first 128KB where EXIF resides
  });
}

function readRationals(view, offset, count, bigEndian) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const num = view.getUint32(offset + i * 8, bigEndian);
    const den = view.getUint32(offset + i * 8 + 4, bigEndian);
    result.push(den === 0 ? 0 : num / den);
  }
  return result;
}
